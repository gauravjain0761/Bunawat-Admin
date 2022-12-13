import { mockDataInfluncerUserList, mockDataResellerUserList } from 'fake-db/data/user/userList'
import React from 'react'
import UserList from '../userList'

const Reseller = () => {
    return (
        <UserList data={mockDataResellerUserList} type="Resellers" />
    )
}

export default Reseller