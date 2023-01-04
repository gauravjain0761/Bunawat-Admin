import { mockDataCustomerUserList, mockDataInfluncerUserList } from 'fake-db/data/user/userList'
import React from 'react'
import UserList from '../userList'

const Customer = () => {
    return (
        <UserList data={mockDataCustomerUserList} type="customer" />
    )
}

export default Customer