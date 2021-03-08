import { Button, Grid, Typography } from "@material-ui/core";
import { LaunchRounded } from "@material-ui/icons";
import { Card } from "components/Card";
import { useRegulator } from "hooks/useRegulator";

export const RegulatorCard = () => {
  const { data } = useRegulator();

  return (
    <Card>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Typography variant="h4" align="center">
            <b>{data ? data.pendingRewards : "0.00"}</b>
          </Typography>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Pending DFT Rewards
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log}
            fullWidth
          >
            Claim Rewards
          </Button>
        </Grid>
        <Grid item md={6}>
          <Typography variant="h4" align="center">
            <b>{data ? data.stakedBalance : "0.00"}</b>
          </Typography>
          <Typography variant="subtitle2" align="center" gutterBottom>
            Staked DFTPv2
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => console.log}
            fullWidth
          >
            Stake / Unstake
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" endIcon={<LaunchRounded />} fullWidth>
            Get DFTPv2 on Uniswap
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};
