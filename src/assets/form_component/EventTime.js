
import React from "react";

const EventTime = ((props) => (
    <select name="evenTime" id="event-form_time" onChange={props.handleInputChange} required>
        <option value="">--Select Time--</option>
        <option value="0100">01:00</option>
        <option value="0115">01:15</option>
        <option value="0130">01:30</option>
        <option value="0145">01:45</option>
        <option value="0200">02:00</option>
        <option value="0215">02:15</option>
        <option value="0230">02:30</option>
        <option value="0245">02:45</option>
        <option value="0300">03:00</option>
        <option value="0315">03:15</option>
        <option value="0330">03:30</option>
        <option value="0345">03:45</option>
        <option value="0400">04:00</option>
        <option value="0415">04:15</option>
        <option value="0430">04:30</option>
        <option value="0445">04:45</option>
        <option value="0500">05:00</option>
        <option value="0515">05:15</option>
        <option value="0530">05:30</option>
        <option value="0545">05:45</option>
        <option value="0600">06:00</option>
        <option value="0615">06:15</option>
        <option value="0630">06:30</option>
        <option value="0645">06:45</option>
        <option value="0700">07:00</option>
        <option value="0715">07:15</option>
        <option value="0730">07:30</option>
        <option value="0745">07:45</option>
        <option value="0800">08:00</option>
        <option value="0815">08:15</option>
        <option value="0830">08:30</option>
        <option value="0845">08:45</option>
        <option value="0900">09:00</option>
        <option value="0915">09:15</option>
        <option value="0930">09:30</option>
        <option value="0945">09:45</option>
        <option value="1000">10:00</option>
        <option value="1015">10:15</option>
        <option value="1030">10:30</option>
        <option value="1045">10:45</option>
        <option value="1100">11:00</option>
        <option value="1115">11:15</option>
        <option value="1130">11:30</option>
        <option value="1145">11:45</option>
        <option value="1200">12:00</option>
        <option value="1215">12:15</option>
        <option value="1230">12:30</option>
        <option value="1245">12:45</option>
    </select>
));


export default EventTime;