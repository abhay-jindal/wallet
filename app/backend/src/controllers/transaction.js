const Card = require('../models/card')
const Transaction = require('../models/transaction')
const Customer = require('../models/customer')
const moment = require('moment')
const { InvokeCustomError } = require('../errors/InvokeCustomError')
const client = require('../db/mongoose')
const newUid = require('../utils/uuidGenerator')
const excel4node = require("excel4node");


exports.transfer = async (req, res, next) => {
    const data = req.body;
    const amount = Number(data.amount)
    try {
        if (req.customer.email === data.destination) throw new InvokeCustomError('AccountTransferError');
        const destination = await Customer.findByCredentials(data.destination)
        if (!destination) throw new InvokeCustomError('AccountNotFoundError');

        const source = await Customer.findByCredentials(req.customer.email, data.password) // double checking if user is authenticated or not
        if (!source) throw new InvokeCustomError('AccountNotFoundError');

        const s_card = await Card.findById(source.card);
        const d_card = await Card.findById(destination.card);
        if (s_card.amount < amount) {
            throw new InvokeCustomError('PayloadValidationError', "Insufficient funds to make an transfer. Reacharge now!.")
        }
        
        if (amount <= 0 || amount > 5000) {
            throw new InvokeCustomError('PayloadValidationError', 'Payable amount should be limited to 0-5000 only.')
        }

        const transaction = new Transaction({
            _id: newUid('txn'),
            amount,
            description: data.description,
            source: source._id,
            destination: destination._id,
            status: 'captured'
        })

        const session = await client.startSession();
        try {
            session.startTransaction();
            await transaction.save({ session })
            
            source.transactions.push(transaction._id)
            await source.save({session})

            s_card.amount -= amount;
            d_card.amount += amount;
            await s_card.save({ session })
            await d_card.save({ session })

            await session.commitTransaction();
            return res.status(202).send({ message: `Money transfer is successful to ${destination.email}`, new_balance: source.balance })
        } catch (err) {
            await session.abortTransaction()
            res.status(400).send({
                message: 'Transaction cannot be processed right now. Please try again later. ' + err
            })
        } finally {
            session.endSession();
        }
    } catch (err){
        next(err)
    }
}

exports.get_transfer_history = async (req, res, next) => {
    let payload = []
    const customer = req.customer
    const page = parseInt(req.query.page) || 0;
    const pageSize = 10;
  // Slice the products array based on the indexes
    try {
        const debit = await Transaction.find({'_id': { $in: customer.transactions}}).populate('destination', 'email')
        const credit = await Transaction.find({'destination': { $in: customer }}).populate('source', 'email')
        const transactions =  debit.concat(credit);

        // Calculate the start and end indexes for the requested page
        const startIndex = (page - 1) * pageSize;
        const endIndex = page ? page * pageSize : transactions.length;
  

        const transData = transactions.sort(function(a, b) {
            const keyA = new Date(a.createdAt);
            const keyB = new Date(b.createdAt);
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        }).reverse().slice(startIndex, endIndex);

        for (let data of transData) {
            payload.push({
                'id': data._id,
                'customer': data.destination?.email || data.source?.email,
                'action': data.destination && data.destination.email ? 'debit' : 'credit',
                'amount': Number(data.amount),
                'currency': 'INR',
                'note': data.description,
                'status': data.status,
                'created_at': moment(data.createdAt).format('MMM DD YYYY, h:mm a')
            })
        }

        return res.status(200).send({ data: payload, total: transactions.length})
    } catch (err) {
        next(err)
    }  
}

function normalizeValue(value) {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (!value) return "-";
    if (Array.isArray(value)) return value.toString();
    if (typeof value !== "string") return JSON.stringify(value);
    return value;
}

function createCell(wb, sheet, row, col, value, alignment, color, row2, col2) {
    value = normalizeValue(value);
    if (row2 && col2) {
        sheet.cell(row, col, row2, col2, true).string(value);
    } else {
        sheet.cell(row, col).string(value);
    }

    let styleJSON = {};
    if (alignment) styleJSON.alignment = { horizontal: alignment };
    if (color) {
        styleJSON.fill = {
            type: "pattern",
            patternType: "solid",
            fgColor: color
        };
    }
    if (Object.keys(styleJSON).length) {
        sheet.cell(row, col).style(wb.createStyle(styleJSON));
    }

    return value.length;
}

function createTableSection(wb, sheet, header, json, startingRow) {
    let cols = {};
    let col_num = 65;
    for (let i in json) {
        for (let f in json[i]) {
            cols[f] = json[i][f].display;
        }
    }
    const cCount = Object.keys(cols).length;
    if (!cCount) return { row: startingRow, colWidths: {} };

    let data = {};
    for (let f in cols) {
        data[f] = [];
        for (let i in json) {
            data[f].push(json[i][f] ? json[i][f].value : "");
        }
    }

    let row = startingRow;
    if (header) {
        createCell(wb, sheet, row, 1, header, "center", "#b8b8b8", row, cCount);
        row++;
    }

    let lastRow = row;
    let colWidths = {};
    let col = 1;
    const startRow = row;
    for (let c in cols) {
        row = startRow;
        colWidths[col] = cols[c].length > 10 ? cols[c].length : 5;
        createCell(wb, sheet, row, col, cols[c], "center", "#e3e3e3");
        for (let r in data[c]) {
            row++;
            if (row > lastRow) lastRow = row;
            const width = createCell(wb, sheet, row, col, data[c][r], "center");
            if (width > colWidths[col]) colWidths[col] = width;
        }
        col++;
    }
    return { row: lastRow, colWidths: colWidths };
}

function createFormSection(wb, sheet, header, json, startingRow) {
    let row = startingRow;
    if (header) {
        createCell(wb, sheet, row, 1, header, "center", "#b8b8b8", row, 2);
        row++;
    }

    let colWidths = { 1: 5, 2: 5 };
    for (let f in json) {
        let val;
        let width;
        let col = 1;

        val = json[f].display;
        width = createCell(wb, sheet, row, col, val, "right", "#e3e3e3");
        if (width > colWidths[col]) colWidths[col] = width;
        col++;

        val = json[f].value;
        width = createCell(wb, sheet, row, col, val, "left");
        if (width > colWidths[col]) colWidths[col] = width;
        row++;
    }
    return { row: row, colWidths: colWidths };
}

function createSection(wb, sheet, section, row) {
    if (section.type === "table") {
        return createTableSection(wb, sheet, section.header, section.data, row);
    } else if (section.type === "form") {
        return createFormSection(wb, sheet, section.header, section.data, row);
    }
    return { row: row, colWidths: {} };
}

function createExcel(json) {
    let wb = new excel4node.Workbook({
        defaultFont: {  size: 10 }
    });

    for (let tab in json) {
        let row = 1;
        let sheet = wb.addWorksheet(json[tab].name);
        let colWidths = {};
        for (let s in json[tab].sections) {
            const section = json[tab].sections[s];
            const result = createSection(wb, sheet, section, row);
            if (result.row !== row) row = result.row + 2;
            for (let c in result.colWidths) {
                if (!colWidths[c]) colWidths[c] = result.colWidths[c];
                if (result.colWidths[c] > colWidths[c]) {
                    colWidths[c] = result.colWidths[c];
                }
            }
        }
        for (let c in colWidths) {
            let width = colWidths[c] + 5;
            if (width > 30) width = 30;
            sheet.column(parseInt(c)).setWidth(width);
        }
    }
    // writeToBuffer is a promise, caller must wait
    return wb.writeToBuffer();
}

exports.export_transfer_history = async (req, res, next) => {
   
    const json = {}

    const debit = await Transaction.find({'_id': { $in: req.customer.transactions}}).populate('destination', 'email')
    const credit = await Transaction.find({'destination': { $in: req.customer }}).populate('source', 'email')
    transData =  debit.concat(credit)

    transData.sort(function(a, b) {
        const keyA = new Date(a.createdAt);
        const keyB = new Date(b.createdAt);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    }).reverse();

    const payload = []

    for (let data of transData) {
        payload.push({
            'id': { display: "Transaction ID", value: data.id },
            'customer': { display: "Customer", value: data.destination?.email || data.source?.email },
            'action': { display: "Action", value: data.destination && data.destination.email ? 'debit' : 'credit' },
            'amount': { display: "Amount", value: Number(data.amount)},
            'currency': { display: "Currency", value: 'INR' },
            'note': { display: "Note", value: data.description },
            'status': { display: "Status", value: data.status },
            'created_at': { display: "Timestamp", value: moment(data.createdAt).format('MMM DD YYYY, h:mm a') },
        })
    }

    json.transactions = {
        name: "e-Wallet Transactions",
        sections: [{ type: "table", data: payload }]
    };

    // res.write(JSON.stringify(json));
    // res.end();

    createExcel(json).then(buffer => {
        // const data = buffer.toString("base64")
        res.status(200).send(buffer.toString("base64"))
        // return {statusCode: 200, data: buffer.toString("base64") };

    });
    // let payload = []
    // let transData = []
    // const customer = req.customer
    // try {
    //     const debit = await Transaction.find({'_id': { $in: customer.transactions}}).populate('destination', 'email')
    //     const credit = await Transaction.find({'destination': { $in: customer }}).populate('source', 'email')
    //     transData =  debit.concat(credit)

    //     transData.sort(function(a, b) {
    //         const keyA = new Date(a.createdAt);
    //         const keyB = new Date(b.createdAt);
    //         // Compare the 2 dates
    //         if (keyA < keyB) return -1;
    //         if (keyA > keyB) return 1;
    //         return 0;
    //     }).reverse();

    //     for (let data of transData) {
    //         payload.push({
    //             'id': data._id,
    //             'customer': data.destination?.email || data.source?.email,
    //             'action': data.destination && data.destination.email ? 'debit' : 'credit',
    //             'amount': Number(data.amount),
    //             'note': data.description,
    //             'date': moment(data.createdAt).format('MMM DD YYYY, h:mm a')
    //         })
    //     }

    //     return res.status(200).send(payload)
    // } catch (err) {
    //     next(err)
    // }  
}


