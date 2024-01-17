import PropTypes from "prop-types"
// import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import PostAddIcon from "@mui/icons-material/PostAdd"

import {
  Avatar,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material"

export const OverviewTotalProfit = (props: any) => {
  const { value, sx, text } = props

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              {text}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: "primary.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <PostAddIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

// OverviewTotalProfit.propTypes = {
//   value: PropTypes.string,
//   sx: PropTypes.object,
// }
