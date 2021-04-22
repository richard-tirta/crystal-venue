
import React, { useEffect, useState, useContext } from "react";
import { EventContext } from './EventContext';

export default function NavProfileView(props) {
    const data = useContext(EventContext)[0];

    return (
        <a href={data.userName ? '/profile.html' : '/profile'}>
            {data.userName ? 'Profile (' + data.userName + ')' : 'Login'}
        </a>
    );
}
