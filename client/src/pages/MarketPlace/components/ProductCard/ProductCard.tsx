import {
  Card,
  Box,
  Typography,
  CardMedia,
  CardContent,
  Button,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

interface IProductCardProps {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string[];
  addToCart: any;
}

function ProductCard(props: IProductCardProps) {
  const theme = useTheme();
  const {t} = useTranslation();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addCartValidity, setAddCartValidity] = useState(true);
  const customTheme = createTheme({
    ...theme,
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            '& .hidden-button': {
              display: 'none',
            },
            '&:hover .hidden-button': {
              display: 'flex',
            },
            '&:hover .title': {
              WebkitLineClamp: '2',
            },
          },
        },
      },
    },
  });

  const cardStyle = {
    maxWidth: 245,
    marginRight: 1,
    '&:hover': {transform: 'scale3d(1.10, 1.10, 1)'},
    [theme.breakpoints.between(1850, 1950)]: {
      minHeight: 212,
    },
    [theme.breakpoints.between(1500, 1850)]: {
      minHeight: 190,
    },
    [theme.breakpoints.between(950, 1180)]: {
      minHeight: 205,
    },
    [theme.breakpoints.between(750, 950)]: {
      minHeight: 184,
    },
  };

  const titleStyle = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    mr: 0.6,
    [theme.breakpoints.between(1530, 1950)]: {
      WebkitLineClamp: '2',
    },
    [theme.breakpoints.between(600, 1180)]: {
      WebkitLineClamp: '2',
    },
  };

  const addToCart = (
    id: string,
    title: string,
    image: string,
    points: number,
    size: string,
  ) => {
    if (props.size && selectedSize) {
      props.addToCart(
        props.id,
        props.title,
        props.image,
        props.points,
        selectedSize,
      );
      setSelectedSize('');
    } else if (props.size === undefined) {
      props.addToCart(
        props.id,
        props.title,
        props.image,
        props.points,
        selectedSize,
      );
      setSelectedSize('');
    } else {
      setAddCartValidity(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Card sx={cardStyle}>
        <Box sx={{mt: 1, mb: 1, mr: 1.5, ml: 1.5, maxHeight: 140}}>
          <CardMedia
            sx={{
              maxHeight: 130,
              borderRadius: 2,
            }}
            component="img"
            image={props.image}
          />
        </Box>
        <CardContent
          sx={{
            paddingTop: 0,
            '&:last-child': {
              paddingBottom: 2,
            },
          }}
        >
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            className="title"
            sx={titleStyle}
          >
            {props.title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {props.points} {t<string>('marketplace.Coins')}
          </Typography>
          {props.size && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                ml: 1,
                mr: 0.8,
              }}
            >
              {props.size.map((i) => (
                <Button
                  variant="outlined"
                  size="small"
                  className="hidden-button"
                  sx={{
                    fontSize: 10,
                    mt: 1,
                    minWidth: '25px !important',
                    borderRadius: 20,
                    [theme.breakpoints.between(0, 600)]: {
                      mr: 0.6,
                    },
                    [theme.breakpoints.between(600, 1000)]: {
                      mr: 0.2,
                    },
                    [theme.breakpoints.up(1000)]: {
                      mr: 1,
                    },
                    [theme.breakpoints.between(600, 750)]: {
                      minWidth: '20px !important',
                    },
                    backgroundColor:
                      selectedSize === i
                        ? theme.palette.primary.main
                        : theme.interface.main,
                    color:
                      selectedSize === i
                        ? theme.interface.main
                        : theme.palette.primary.main,
                    '&:hover': {
                      color:
                        selectedSize === i
                          ? theme.interface.main
                          : theme.palette.primary.main,
                      backgroundColor:
                        selectedSize === i
                          ? theme.palette.primary.main
                          : theme.interface.main,
                    },
                  }}
                  key={i}
                  onClick={() => {
                    if (selectedSize === i) setSelectedSize('');
                    else setSelectedSize(i);
                    setAddCartValidity(true);
                  }}
                >
                  {t<string>(`marketplace.sizes.${i}`)}
                </Button>
              ))}
            </Box>
          )}
          {!addCartValidity && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography
                className="hidden-button"
                sx={{fontSize: 13, color: theme.palette.error.dark}}
              >
                {t<string>('marketplace.sizes.selectSize')}
              </Typography>
            </Box>
          )}
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant="outlined"
              size="small"
              className="hidden-button"
              sx={{marginTop: 1, fontSize: 12}}
              onClick={() =>
                addToCart(
                  props.id,
                  props.title,
                  props.image,
                  props.points,
                  selectedSize,
                )
              }
            >
              {t<string>('marketplace.AddToCart')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ProductCard;
