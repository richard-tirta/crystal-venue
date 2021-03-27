
import React from "react";

const Aetheryte = ((props) => (
    <select name="venueAetheryte" id="venue-form_aetheryte" onChange={props.onChange} required>
        <option value="">--Select Nearby Aetheryte Shard--</option>
        {
            !props.venueLocation || props.venueLocation === 'Lavender Beds'
                ? (
                    <React.Fragment>
                        <option value="Amethyst Shallows">Amethyst Shallows</option>
                        <option value="Dappled Stalls">Dappled Stalls</option>
                        <option value="Lavender Northwest">Lavender Northwest</option>
                        <option value="Wildflower Stalls">Wildflower Stalls</option>
                        <option value="Lavender Southeast">Lavender Southeast</option>
                        <option value="Lavender Southwest">Lavender Southwest</option>
                        <option value="Lavender East">Lavender East</option>
                        <option value="Lily Hills">Lily Hills</option>
                        <option value="Dappled Stalls Subdivision">Dappled Stalls Subdivision</option>
                        <option value="Lavender Northeast Subdivision">Lavender Northeast Subdivision</option>
                        <option value="Wildflower Stalls Subdivision">Wildflower Stalls Subdivision</option>
                        <option value="Lavender Southwest Subdivision">Lavender Southwest Subdivision</option>
                        <option value="Lavender Northwest Subdivision">Lavender Northwest Subdivision</option>
                        <option value="Lavender South Subdivision">Lavender South Subdivision</option>
                        <option value="Amethyst Shallows Subdivision">Amethyst Shallows Subdivision</option>
                        <option value="Lilly Hills Subdivision">Lilly Hills Subdivision</option>
                    </React.Fragment>
                )
                : null
        }

        {
            !props.venueLocation || props.venueLocation === 'Mist'
                ? (
                    <React.Fragment>
                         <option value="Mistgate Square">Mistgate Square</option>
                        <option value="Mist West">Mist West</option>
                        <option value="Mist Northeast">Mist Northeast</option>
                        <option value="Seagaze Markets">Seagaze Markets</option>
                        <option value="Mist Southeast">Mist Southeast</option>
                        <option value="Mist South (Docks)">Mist South (Docks)</option>
                        <option value="Mist East">Mist East</option>
                        <option value="The Topmast">The Topmast</option>
                        <option value="Mistgate Square Subdivision">Mistgate Square Subdivision</option>
                        <option value="Mist Northeast Subdivision">Mist Northeast Subdivision</option>
                        <option value="Mist Southeast Subdivision">Mist Southeast Subdivision</option>
                        <option value="Seagaze Markets Subdivision">Seagaze Markets Subdivision</option>
                        <option value="Mist Southwest Subdivision">Mist Southwest Subdivision</option>
                        <option value="Mist Northwest Subdivision">Mist Northwest Subdivision</option>
                        <option value="Central Mist Subdivision">Central Mist Subdivision</option>
                        <option value="The Topmast Subdivision">The Topmast Subdivision</option>
                    </React.Fragment>
                )
                : null
        }

        {
            !props.venueLocation || props.venueLocation === 'Goblet'
                ? (
                    <React.Fragment>
                         <option value="Goblet Exchange">Goblet Exchange</option>
                        <option value="Goblet Northeast">Goblet Northeast</option>
                        <option value="Goblet West">Goblet West</option>
                        <option value="Goblet Southeast">Goblet Southeast</option>
                        <option value="Goblet North">Goblet North</option>
                        <option value="Goblet East">Goblet East</option>
                        <option value="The Brimming Heart">The Brimming Heart</option>
                        <option value="The Sultana's Breath">The Sultana's Breath</option>
                        <option value="Goblet Exchange Subdivision">Goblet Exchange Subdivision</option>
                        <option value="Goblet Southeast Subdivision">Goblet Southeast Subdivision</option>
                        <option value="Goblet North Subdivision">Goblet North Subdivision</option>
                        <option value="The Brimming Heart Subdivision">The Brimming Heart Subdivision</option>
                        <option value="Goblet Southwest Subdivision">Goblet Southwest Subdivision</option>
                        <option value="Goblet East Subdivision">Goblet East Subdivision</option>
                        <option value="Goblet South Subdivision">Goblet South Subdivision</option>
                        <option value="The Sultana's Breath Subdivision">The Sultana's Breath Subdivision</option>
                    </React.Fragment>
                )
                : null
        }

        {
            !props.venueLocation || props.venueLocation === 'Shirogane'
                ? (
                    <React.Fragment>
                                <option value="Akanegumo Bridge">Akanegumo Bridge</option>
                                <option value="Northwestern Shirogane">Northwestern Shirogane</option>
                                <option value="Western Shirogane">Western Shirogane</option>
                                <option value="Kobai Goten">Kobai Goten</option>
                                <option value="Northeastern Shirogane">Northeastern Shirogane</option>
                                <option value="Southwestern Shirogane">Southwestern Shirogane</option>
                                <option value="Southern Shirogane">Southern Shirogane</option>
                                <option value="Southeastern Shirogane">Southeastern Shirogane</option>
                                <option value="Akanegumo Bridge Subdivision">Akanegumo Bridge Subdivision</option>
                                <option value="Eastern Shirogane Subdivision">Eastern Shirogane Subdivision</option>
                                <option value="Northeastern Shirogane Subdivision">Northeastern Shirogane Subdivision</option>
                                <option value="Kobai Goten Subdivision">Kobai Goten Subdivision</option>
                                <option value="Southern Shirogane Subdivision">Southern Shirogane Subdivision</option>
                                <option value="Northern Shirogane Subdivision">Northern Shirogane Subdivision</option>
                                <option value="Western Shirogane Subdivision">Western Shirogane Subdivision</option>
                                <option value="Southwestern Shirogane Subdivision">Southwestern Shirogane Subdivision</option>
                    </React.Fragment>
                )
                : null
        }
    </select> 
));


export default Aetheryte;