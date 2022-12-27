import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';


const DragHandle = SortableHandle(({ style }) => (
    <span style={{ ...style, ...{ cursor: 'move' } }}> {'::::'} </span>)
)

const TableBodySortable = SortableContainer(({ children }) => (
    <TableBody  >
        {children}
    </TableBody >
))

const Row = SortableElement(({ data, ...other }) => {
    return (
        <TableRow>
            <TableCell style={{ width: '5%' }} >
                <DragHandle />
            </TableCell>
            <TableCell>
                {data.id}
            </TableCell>
            <TableCell>
                {data.name}
            </TableCell>
            <TableCell>
                {data.status}
            </TableCell>
        </TableRow >
    )
})

const DragTable = () => {
    const [rowData, setRowData] = useState([
        {
            id: 1,
            name: 'People 1',
            status: 'enabled'
        },
        {
            id: 2,
            name: 'People 2',
            status: 'disabled'
        },
        {
            id: 3,
            name: 'People 1',
            status: 'enabled'
        }
    ]);

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setRowData(arrayMove(rowData, oldIndex, newIndex));
    }

    return (
        <Box sx={{ p: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '5%' }}>&nbsp; </TableCell>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBodySortable onSortEnd={onSortEnd} useDragHandle>
                    {rowData.map((row, index) => {
                        return (
                            <Row
                                index={index}
                                key={row.id}
                                data={row}
                            />
                        )
                    })}
                </TableBodySortable>
            </Table>
        </Box>
    )
}

export default DragTable