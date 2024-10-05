import * as React from 'react';

import { Button, Container, Divider, Pagination, Stack, Tab, TableFooter, TablePagination, Tabs } from '@mui/material';
import { CloudDownload } from '@mui/icons-material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';


import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  // createData('Gingerbread', 356, 16.0, 49, 3.9),
  // createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function Transaction(props) {

  return (
    <Container maxWidth="sm" sx={{ my: 2 }} >
      {/* <div style={{ my: 2, float: 'left' }} className={props.classes.header}  >
        Transactions
      </div> */}

    <Container>
    <Tabs
            // value={action}
            variant="scrollable"
            aria-label="wrapped label tabs example"
          >
            <Tab
              value="TRANSFER"
              label="Transfer Money"
              wrapped
              
              sx={{textTransform: 'none'}}
              // onClick={() => setAction('TRANSFER')}
            />
            <Tab value="RECHARGE" wrapped label="Recharge Card" sx={{textTransform: 'none'}}  />
            <Tab value="REQUEST" wrapped label="Request Money" sx={{textTransform: 'none'}}  />
            {/* <Tab value="TRANSACTION" wrapped label="Show Transactions" sx={{textTransform: 'none'}}  /> */}
          </Tabs>
          <Divider />
    </Container>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Txn ID</StyledTableCell>
            <StyledTableCell align="right">Customer</StyledTableCell>
            <StyledTableCell align="right">Amount</StyledTableCell>
            <StyledTableCell align="right">Timestamp</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.id}
              </StyledTableCell>
              <StyledTableCell align="right">{row.customer}</StyledTableCell>
              <StyledTableCell align="right" sx={{ color: row.action === 'debit' ? 'red' : 'green' }}>{row.action === 'debit' ? '-' : '+'} &#8377;{row.amount}</StyledTableCell>
              <StyledTableCell align="right">{row.created_at}</StyledTableCell>
              {/* <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
            </StyledTableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              colSpan={3}
              count={15}
              rowsPerPage={10}
              page={0}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              // onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
              // ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>



     
{/* 
      <List sx={{ width: '100%' }}>
        {props.rows.map((row) => (
          <>
            <ListItem secondaryAction={<span style={{ color: row.action === 'debit' ? 'red' : 'green' }}>{row.action === 'debit' ? '-' : '+'} &#8377;{row.amount}</span>
            }>
              <ListItemAvatar>
                <Avatar>
                  {row.customer[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={row.customer} secondary={row.date} />
            </ListItem>
            <Divider component="li" />
          </>
        ))}
      </List> */}

      {/* <Stack spacing={4} sx={{ float: 'right', mt: 2, mb: 5 }}>
        <Pagination count={5} variant="outlined" color="primary" />
      </Stack> */}
    </Container>
  );
}
