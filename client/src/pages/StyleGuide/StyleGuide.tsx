/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import {useTheme} from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import {ReactNode} from 'react';
import PageFrame from '@shared/components/PageFrame';

interface ColorBoxProps {
  color: string;
  title: string;
  description: string;
}

interface CodeBlockProps {
  children: ReactNode | string | ReactNode[];
}

const ColorBox = (props: ColorBoxProps) => {
  const {color, title, description} = props;
  const theme = useTheme();
  return (
    <Card
      sx={{
        minWidth: 275,
        background: color,
        border: `1px solid ${theme.palette.divider}`,
        color: `{theme.palette.getContrastText(color)}`,
        boxShadow: 0,
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" color={theme.palette.getContrastText(color)}>
          {title}
        </Typography>
        <Typography sx={{mb: 1.5}} color={theme.palette.getContrastText(color)}>
          {description}
        </Typography>
        <Typography
          variant="body2"
          color={theme.palette.getContrastText(color)}
        />
      </CardContent>
    </Card>
  );
};

const CodeBlock = (props: CodeBlockProps) => {
  const theme = useTheme();
  const {children} = props;
  return (
    <Box
      sx={{
        background: theme.interface.contrastMain,
        borderRadius: theme.borderRadius.default,
        mb: 2,
      }}
    >
      {children}
    </Box>
  );
};

function StyleGuide() {
  const theme = useTheme();
  return (
    <PageFrame>
      <FullWidthColumn>
        <Typography variant="h1" gutterBottom>
          Style Guide
        </Typography>
        <Typography variant="h2" gutterBottom>
          Colors
        </Typography>
        <Typography variant="h5" gutterBottom>
          Usage
        </Typography>
        <CodeBlock>
          <pre style={{padding: 0, margin: 0}}>{`
    import {useTheme} from '@mui/material/styles';
    color={theme.palette.primary.main}
      `}</pre>
        </CodeBlock>

        <Typography variant="h3" gutterBottom>
          Interface Element Colors
        </Typography>
        <ColorBox
          color={theme.interface.main}
          title="theme.interface.main"
          description="Use for main interface backgrounds like nav bar, it will contrast with main background"
        />
        <ColorBox
          color={theme.interface.contrastMain}
          title="theme.interface.contrastMain"
          description="Use for elements that need contrast with the main interface background, like the search bar"
        />
        <ColorBox
          color={theme.interface.offBackground}
          title="theme.interface.offBackground"
          description="White when in light mode but will be off dark mode background, useful for elements that have drop shadows but need more contrast in dark mode. Used in search overlay when search is open."
        />
        <Typography variant="h3" gutterBottom>
          Main colors
        </Typography>
        <ColorBox
          color={theme.palette.primary.main}
          title="theme.palette.primary.main"
          description="Primary color, use for primary buttons etc."
        />
        <ColorBox
          color={theme.palette.primary.light}
          title="theme.palette.primary.light"
          description="Lighter version of primary color"
        />
        <ColorBox
          color={theme.palette.secondary.main}
          title="theme.palette.secondary.main"
          description="Secondary color, use for secondary buttons etc."
        />
        <ColorBox
          color={theme.palette.secondary.light}
          title="theme.palette.secondary.light"
          description="Lighter version of secondary color"
        />
        <ColorBox
          color={theme.palette.success.main}
          title="theme.palette.secondary.light"
          description="Lighter version of secondary color"
        />
        <Typography variant="h2" gutterBottom mt={2}>
          Typography
        </Typography>
        <Typography variant="h5" gutterBottom>
          Usage
        </Typography>
        <CodeBlock>
          <pre style={{padding: 0, margin: 0}}>
            {`
    <Typography variant="h1" gutterBottom>
     h1. Heading
    </Typography>
      `}
          </pre>
        </CodeBlock>

        <Typography variant="h1" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom>
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom>
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom>
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom>
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom>
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" display="block" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          caption text
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          overline text
        </Typography>

        <Typography variant="h2" gutterBottom mt={2}>
          Buttons
        </Typography>
        <Typography variant="h5" gutterBottom>
          Usage
        </Typography>
        <CodeBlock>
          <pre style={{padding: 0, margin: 0}}>
            {`
    <Button>Primary</Button>
    <Button variant="contained" color="secondary">Contained</Button>
    <Button color="secondary">Primary</Button>
    <Button variant="outlined" color="secondary">
      `}
          </pre>
        </CodeBlock>
        <Typography variant="h5" gutterBottom>
          Primary
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Contained</Button>
          <Button>Primary</Button>
          <Button variant="outlined">Outlined</Button>
        </Stack>
        <br />
        <Typography variant="h5" gutterBottom>
          Secondary
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="secondary">
            Contained
          </Button>
          <Button color="secondary">Primary</Button>
          <Button variant="outlined" color="secondary">
            Outlined
          </Button>
        </Stack>
        <Typography variant="h2" gutterBottom mt={2}>
          Forms
        </Typography>
        <Typography variant="h5" gutterBottom>
          Example
        </Typography>
        <InputLabel id="language-select-label">Select Language</InputLabel>
        <Select
          labelId="language-select-label"
          data-testid="language-selector"
          value="fr"
        >
          <MenuItem value="fr">French</MenuItem>
          <MenuItem value="en">English</MenuItem>
        </Select>
        <br />
        <CodeBlock>
          <pre style={{padding: 0, margin: 0}}>{`
    <InputLabel id="language-select-label">
        {t('layout.SelectLanguage')}
    </InputLabel>
    <Select
        labelId="language-select-label"
        data-testid="language-selector"
        value={i18n.language.substring(0, 2)}
        onChange={handleChange}
    >
        <MenuItem value="fr">{t('layout.French')}</MenuItem>
        <MenuItem value="en">{t('layout.English')}</MenuItem>
    </Select>
      `}</pre>
        </CodeBlock>
        <Link href="https://mui.com/material-ui/react-autocomplete/">
          See documentation for Material UI Input Components
        </Link>
        <Typography variant="h2" gutterBottom mt={2}>
          Spacing
        </Typography>
        <Typography variant="h5" gutterBottom>
          Usage
        </Typography>
        <CodeBlock>
          <pre style={{padding: 0, margin: 0}}>{`
    import {useTheme} from '@mui/material/styles';

    <Chip
        clickable
        key={tag}
        label={tag}
        sx={{marginRight: theme.spacing(1)}}
    />
      `}</pre>
        </CodeBlock>
      </FullWidthColumn>
    </PageFrame>
  );
}

export default StyleGuide;
