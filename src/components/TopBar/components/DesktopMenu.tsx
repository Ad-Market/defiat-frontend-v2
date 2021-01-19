import { Grid } from '@material-ui/core'
import React from 'react'
import SiteMap from '../../../constants/map'
import { MenuLink } from '../../MenuLink'
import { Link } from '../../Link'
import { Web3ConnectButton } from '../../Web3ConnectButton'

export const DesktopMenu = () => {
  return (
    <Grid container spacing={1} alignItems="center">
      {SiteMap.routes.map((route:any, i:number) => (
        <Grid item>
          <Link name={route.name} path={route.path} key={i} />
        </Grid>
      ))}
      <Grid item>
        <MenuLink />
      </Grid>
      {SiteMap.external.map((external:any, i:number) => (
        <Grid item>
          <Link name={external.name} href={external.href} key={i} />
        </Grid>
      ))}
      <Grid item>
        <Web3ConnectButton />
      </Grid>
    </Grid>
  )
}
