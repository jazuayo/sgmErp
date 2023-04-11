import { Grid, CardHeader } from "@mui/material";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

export default function ImageTextSgm(props) {
  const { nombre, imagen } = props;

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      xs={6}
    >
      <Grid item xs={6} padding={2}>
        <Card >
          <CardHeader title={nombre}  titleTypographyProps={{variant:'h7' }}/>
          <CardMedia
            component="img"
            image={imagen}
            alt={nombre}
          />
        </Card>
      </Grid>
    </Grid>
  );
}
