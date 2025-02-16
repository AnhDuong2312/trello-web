import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { cyan, teal, deepOrange, orange } from '@mui/material/colors'

const theme = extendTheme({
    trello: {
        appBarHeight: '58px',
        boardBarHeight: '60px'
    },

    colorSchemes: {
        light: {
            palette: {
                primary: teal,
                secondary: deepOrange
            }
        },

        dark: {
            palette: {
                primary: cyan,
                secondary: orange
            }
        }
    }
})

export default theme;