/* eslint-disable id-length */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
import * as React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Avatar,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import {useTheme} from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import {visuallyHidden} from '@mui/utils';
import moment from 'moment';
import 'moment/dist/locale/fr';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';
import {useEffect, useState} from 'react';

import getTransactions from '@/data/api/requests/transactions';
import ITransaction from '@/data/api/types/ITransaction';

interface Data {
  id: string;
  transaction: string;
  date: Date;
  wallet: string;
  amount: number;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  date: boolean;
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  order: Order;
  orderBy: string;
  // eslint-disable-next-line react/no-unused-prop-types
  rowCount: number;
}

function createData(
  id: string,
  transaction: string,
  date: Date,
  wallet: string,
  amount: number,
): Data {
  return {
    id,
    transaction,
    date,
    wallet,
    amount,
  };
}

const headCells: ReadonlyArray<HeadCell> = [
  {
    id: 'transaction',
    numeric: false,
    date: false,
    disablePadding: true,
    label: 'wallet.transactionTable.Transaction',
  },
  {
    id: 'date',
    numeric: false,
    date: true,
    disablePadding: false,
    label: 'wallet.transactionTable.Date',
  },
  {
    id: 'wallet',
    numeric: false,
    date: false,
    disablePadding: false,
    label: 'wallet.transactionTable.Wallet',
  },
  {
    id: 'amount',
    numeric: true,
    date: false,
    disablePadding: false,
    label: 'wallet.transactionTable.Amount',
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: {[key in Key]: number | string | Date},
  b: {[key in Key]: number | string | Date},
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: ReadonlyArray<T>,
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {t} = useTranslation();
  const {order, orderBy, onRequestSort} = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {t<string>(headCell.label)}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar() {
  const {t} = useTranslation();
  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
      }}
    >
      <Typography
        sx={{flex: '1 1 100%'}}
        variant="subtitle2"
        id="tableTitle"
        component="div"
      >
        {t<string>('wallet.transactionTable.TransactionHistory')}
      </Typography>
    </Toolbar>
  );
}

export default function TransactionTable() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof Data>('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Data[]>([]);

  const theme = useTheme();
  const dispatchAlert = useAlertContext();
  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  moment.locale(lang);

  const {data, status} = useQuery<ITransaction[]>(
    'transactions',
    getTransactions,
  );

  if (data && status === 'success') {
    data.forEach((t) => {
      if (!rows.some((element) => element.id === t.id))
        rows.push(
          createData(
            t.id,
            t.description,
            new Date(t.timestamp),
            t.walletType,
            t.tokenAmount,
          ),
        );
    });
  }

  useEffect(() => {
    if (status === 'error') {
      dispatchAlert.error('Error fetching data');
    }
  }, [dispatchAlert, status]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box
      sx={(theme) => ({
        width: '100%',
        [theme.breakpoints.down('sm')]: {
          width: '95vw',
        },
        [theme.breakpoints.up('md')]: {
          width: '80%',
        },
      })}
    >
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          backgroundColor: theme.interface.offBackground,
          borderRadius: theme.borderRadius.default,
        }}
      >
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            sx={{minWidth: 600}}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.date.getTime().toString()}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                        align="left"
                        sx={{
                          fontWeight: 'medium',
                          color: theme.interface.titleText,
                        }}
                      >
                        {t<string>(
                          `wallet.transactionTable.${row.transaction}`,
                        )}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{color: theme.interface.contrastText}}
                      >
                        {lang === 'en' &&
                          moment(row.date).format('MMM D, YYYY [at] H:mm A')}
                        {lang === 'fr' &&
                          moment(row.date).format('MMM D, YYYY [à] H:mm')}
                      </TableCell>
                      <TableCell align="left">
                        <Box sx={{display: 'flex'}}>
                          {row.wallet === 'toSpend' && (
                            <Avatar
                              sx={{
                                backgroundColor:
                                  theme.interface.type === 'light'
                                    ? '#BCC0FF'
                                    : '#7c7fb8',
                                width: 20,
                                height: 20,
                                marginRight: theme.spacing(1),
                              }}
                              variant="rounded"
                            >
                              <CircleIcon
                                sx={{
                                  width: '20%',
                                  color:
                                    theme.interface.type === 'light'
                                      ? theme.palette.primary.main
                                      : 'white',
                                }}
                              />
                            </Avatar>
                          )}
                          {row.wallet === 'toAward' && (
                            <Avatar
                              sx={{
                                backgroundColor:
                                  theme.interface.type === 'light'
                                    ? '#D0FFF7'
                                    : '#6baca1',
                                width: 20,
                                height: 20,
                                marginRight: theme.spacing(1),
                              }}
                              variant="rounded"
                            >
                              <CircleIcon
                                sx={{
                                  width: '20%',
                                  color:
                                    theme.interface.type === 'light'
                                      ? '#2B9B88'
                                      : 'white',
                                }}
                              />
                            </Avatar>
                          )}
                          {t<string>(`wallet.${row.wallet}`)}
                        </Box>
                      </TableCell>
                      <TableCell align="left">
                        {row.amount.toString().charAt(0) === '-' && (
                          <Typography sx={{color: '#FF2E00'}}>
                            {row.amount.toFixed(2)}
                          </Typography>
                        )}

                        {row.amount.toString().charAt(0) !== '-' && (
                          <Typography sx={{color: '#39ae55'}}>
                            +{row.amount.toFixed(2)}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t<string>('wallet.transactionTable.RowsPage')}
          labelDisplayedRows={({from, to, count}) =>
            `${from}-${to} ${t<string>('wallet.transactionTable.Of')} ${count}`
          }
        />
      </Paper>
    </Box>
  );
}
