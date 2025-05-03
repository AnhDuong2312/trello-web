import  Box  from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip } from '@mui/material'
import Button from "@mui/material/Button"
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'


const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }

}

function BoardBar({ board }) {

  return (
    <Box px={2} sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        '&::-webkit-scrollbar-track': {m: 2}
    }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
            <Chip 
              sx={MENU_STYLES}
              icon={<DashboardIcon />} 
              label={board?.title} 
              clickable
            />

            <Chip 
              sx={MENU_STYLES}
              icon={<VpnLockIcon />} 
              label= {capitalizeFirstLetter(board?.type)}
              clickable
            />

            <Chip 
              sx={MENU_STYLES}
              icon={<AddToDriveIcon />} 
              label="Add to Google Drive" 
              clickable
            />

            <Chip 
              sx={MENU_STYLES}
              icon={<BoltIcon />} 
              label="Automation" 
              clickable
            />

            <Chip 
              sx={MENU_STYLES}
              icon={<FilterListIcon />} 
              label="Filters" 
              clickable
            />
         </Box>

         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
         <Button 
            variant="outlined" 
            startIcon={<PersonAddIcon/>}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: 'white'}
            }}
          >
            Invite
          </Button>
         <AvatarGroup 
            max={6}
            sx={{
              gap: "10px",
              '& .MuiAvatar-root': {
                width: 34,
                height: 34,
                fontSize: 16,
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                '&:first-of-type': { bgcolor: '#a4b0be'}
              }
            }}
            >
            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src="https://scontent.fhan5-2.fna.fbcdn.net/v/t39.30808-1/471305775_1529230447727212_2183701218438019650_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=e99d92&_nc_ohc=QewHY5b0OkgQ7kNvgFM9brq&_nc_oc=AdgNUCgaOQebPPT0UcrGyk3_eiA0zmHr05M1CFP_P-pPsnJJHHtlIvfg7ehPI_-A6Rc&_nc_zt=24&_nc_ht=scontent.fhan5-2.fna&_nc_gid=A_Aho4kdg0PzNyWDa7Uzkjr&oh=00_AYCzb9eLDVRzdLbG_yF_pIqfoTuaVd_fLyVLAeZP2wUqmg&oe=67B15737" />
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src='https://scontent.fhan15-2.fna.fbcdn.net/v/t39.30808-1/434659178_1126161945080980_4802575180386170072_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=eIihBoYV7w8Q7kNvgGbsReo&_nc_oc=Adij4SePKepUmhGkt45UhxBJO0X0Q-m-YRDP6_-018Qsfy-da5M1fv2hkMXQIzNjEF8&_nc_zt=24&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AcJSjlOj1wxMq7xeCL8xMzR&oh=00_AYCO2BwvFVzdw1enZeUwy-2SEIcVJVX2d1V_E2JrYYrIdw&oe=67B771BE' />
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>

            <Tooltip title='anhduongdev'>
              <Avatar 
                alt="AnhDuongDev" 
                src=''
              />  
            </Tooltip>
            
          
        </AvatarGroup>
         </Box>
    </Box>
  )
}

export default BoardBar
