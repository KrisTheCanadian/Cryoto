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
  Paper,
  IconButton,
  Modal,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {useTheme} from '@mui/material/styles';
// eslint-disable-next-line import/no-extraneous-dependencies
import {visuallyHidden} from '@mui/utils';
import moment from 'moment';
import 'moment/dist/locale/fr';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';

import {TableToolbar} from './TableToolbar';
import {EditUserRolesModal} from './EditUserRolesModal';

import {getAllUsersRoles} from '@/data/api/requests/admin';
import IUserRoles from '@/data/api/types/IUserRoles';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
  date: boolean;
}

interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IUserRoles,
  ) => void;
  order: Order;
  orderBy: string;
  // eslint-disable-next-line react/no-unused-prop-types
  rowCount: number;
}

const headCells: ReadonlyArray<HeadCell> = [
  {
    id: 'id',
    numeric: false,
    date: false,
    disablePadding: true,
    label: 'adminDashboard.userManagementTable.userId',
  },
  {
    id: 'username',
    numeric: false,
    date: false,
    disablePadding: true,
    label: 'adminDashboard.userManagementTable.userName',
  },
  {
    id: 'userRoles',
    numeric: false,
    date: false,
    disablePadding: false,
    label: 'adminDashboard.userManagementTable.userRoles',
  },
  {
    id: 'modify',
    numeric: false,
    date: false,
    disablePadding: false,
    label: 'adminDashboard.userManagementTable.modify',
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
  a: {[key in Key]: number | string | string[] | Date},
  b: {[key in Key]: number | string | string[] | Date},
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
    (property: keyof IUserRoles) => (event: React.MouseEvent<unknown>) => {
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

export default function TransactionTable() {
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<keyof IUserRoles>('oId');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<IUserRoles[]>([]);
  const [filteredRows, setFilteredRows] = useState<IUserRoles[]>([]);
  const theme = useTheme();
  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);

  // modal window for editing user
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUserRoles>(
    {} as IUserRoles,
  );
  const closeEditUser = () => {
    setModalEditOpen(false);
  };

  moment.locale(lang);

  const modalStyle = {
    borderRadius: theme.borderRadius.medium,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',

    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
  };

  const filterTable = (searchText: string) => {
    setFilteredRows(
      rows.filter(
        (rowData) =>
          rowData.oId.toLowerCase().includes(searchText.toLowerCase()) ||
          rowData.name.toLowerCase().includes(searchText.toLowerCase()) ||
          rowData.roles
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          searchText === '',
      ),
    );
  };

  const handleSearch = async (event: any) => {
    filterTable(event);
  };

  const retrieveUsers = () => {
    setIsLoading(true);
    getAllUsersRoles()
      .then((data: IUserRoles[]) => {
        setFilteredRows(data);
        setRows(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    retrieveUsers();
  }, []);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IUserRoles,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // this handles the click to click a row
  const openEditUser = (event: React.MouseEvent<unknown>, user: IUserRoles) => {
    setModalEditOpen(true);
    setSelectedUser(user);
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
        }}
      >
        <TableToolbar onSearch={handleSearch} />
        <TableContainer style={{position: 'relative'}}>
          <Table
            sx={{minWidth: 600}}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={row.oId}>
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
                        {row.oId}
                      </TableCell>
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
                        {row.name}
                      </TableCell>
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
                        {row.roles.toString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="edit"
                          onClick={(event) => openEditUser(event, row)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
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
            {isLoading && (
              <Backdrop
                data-testid="Backdrop"
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
                style={{position: 'absolute'}}
                open
              >
                <CircularProgress data-testid="CircularProgress" size="2rem" />
              </Backdrop>
            )}
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
          labelRowsPerPage={t<string>(
            'adminDashboard.userManagementTable.rowsPage',
          )}
          labelDisplayedRows={({from, to, count}) =>
            `${from}-${to} ${t<string>(
              'adminDashboard.userManagementTable.of',
            )} ${count}`
          }
        />
      </Paper>
      <Modal
        open={modalEditOpen}
        onClose={closeEditUser}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <EditUserRolesModal
            handleClose={closeEditUser}
            selectedUser={selectedUser}
            retrieveUsers={retrieveUsers}
          />
        </Box>
      </Modal>
    </Box>
  );
}
