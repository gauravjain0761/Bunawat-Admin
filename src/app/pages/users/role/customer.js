import { mockDataCustomerUserList, mockDataInfluncerUserList } from 'fake-db/data/user/userList'
import React from 'react'
import UserList from '../userList'

const Customer = () => {
    return (
        <UserList data={mockDataCustomerUserList} type="Customer" />
    )
}

export default Customer