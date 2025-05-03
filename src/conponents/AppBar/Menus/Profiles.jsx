import React from "react"
import Box  from "@mui/material/Box"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

function Profiles() {

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        setAnchorEl(null)
    };

  return (
    <Box>
    

    <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ padding: 0 }}
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar
                sx={{ width: 34, height: 34 }}
                alt="AnhDuongDev"
                src="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-1/471305775_1529230447727212_2183701218438019650_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=QewHY5b0OkgQ7kNvgFM9brq&_nc_oc=AdgNUCgaOQebPPT0UcrGyk3_eiA0zmHr05M1CFP_P-pPsnJJHHtlIvfg7ehPI_-A6Rc&_nc_zt=24&_nc_ht=scontent.fhan5-2.fna&_nc_gid=A_Aho4kdg0PzNyWDa7Uzkjr&oh=00_AYCzb9eLDVRzdLbG_yF_pIqfoTuaVd_fLyVLAeZP2wUqmg&oe=67B15737"
            />
          </IconButton>
        </Tooltip>

    <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles',
        }}
    >
        <MenuItem >
          <Avatar sx={{width: '28px', height: '28px', marginRight: 2}} /> Profile
        </MenuItem>
        <MenuItem >
          <Avatar sx={{width: '28px', height: '28px', marginRight: 2}}/> My account
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
    </Menu>
    </Box>
  )
}

export default Profiles
