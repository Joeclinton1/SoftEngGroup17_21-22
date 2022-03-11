import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
const DynamicSelect = ({id, label, state, changeCookie, handleChange, MenuItems}) => (
    /*
    id: a unique name to describe the form input
    label: the human readable name that will be displayed
    value: the value connected to the state
    handleChange: function to be called on value change
    changeCookie: function to be called to update cookie values
    MenuItems: list of (value, label) pairs    
    */
    <FormControl fullWidth>
        <InputLabel id={`${id}-select-label`}>{label}</InputLabel>
        <Select
            labelId={`${id}-select-label`}
            id={`${id}-select`}
            value={state[id]}
            label={label}
            onChange={(event)=>{
                handleChange(id, event)
                changeCookie(id, event.target.value)
            }}
        >
        {MenuItems.map(([value,label], index) =>(
            <MenuItem key= {index} value={value}>{label}</MenuItem>
        ))}
        </Select>
    </FormControl>
)

export default DynamicSelect;