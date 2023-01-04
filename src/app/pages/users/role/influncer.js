import { mockDataInfluncerUserList } from 'fake-db/data/user/userList'
import React from 'react'
import UserList from '../userList'

const Influncer = () => {
    return (
        <UserList data={mockDataInfluncerUserList} type="influencer" />
    )
}

export default Influncer