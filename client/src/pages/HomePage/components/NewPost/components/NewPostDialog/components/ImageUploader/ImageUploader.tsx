import {
  Box,
  Card,
  CardActions,
  CardMedia,
  IconButton,
  styled,
  useTheme,
} from '@mui/material';
import {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useTranslation} from 'react-i18next';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface FileToUpload {
  file: File | null;
  preview: string | null;
}
interface ImageUploaderProps {
  setFileUploadOpen: (fileUploadOpen: boolean) => void;
}

const StyledDropZone = styled(Box)(({theme}) => ({
  background: theme.interface.contrastMain,
  width: 'calc(100% - theme.spacing(2))',
  borderRadius: theme.borderRadius.medium,
  border: `1px dashed ${theme.palette.grey[500]}`,
  display: 'flex',
  justifyContent: 'center',
  margin: theme.spacing(0, 2, 2, 2),
}));

function ImageUploader(props: ImageUploaderProps) {
  const theme = useTheme();
  const {setFileUploadOpen} = props;
  const [file, setFile] = useState<FileToUpload>({file: null, preview: null});
  const {t} = useTranslation();
  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile({
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });
    },
  });

  const handleRemoveImage = () => {
    setFile({file: null, preview: null});
    setFileUploadOpen(false);
  };

  return (
    <Card
      sx={{
        maxWidth: '100%',
        marginTop: theme.spacing(2),
        background: 'inherit',
      }}
      variant="outlined"
    >
      <CardActions
        sx={{
          justifyContent: 'flex-end',
          background: 'inherit',
        }}
      >
        <IconButton
          onClick={handleRemoveImage}
          data-testid="remove-image-button"
        >
          <HighlightOffIcon />
        </IconButton>
      </CardActions>
      {!file.preview && (
        <StyledDropZone {...getRootProps({className: 'dropzone'})}>
          <input autoComplete="false" {...getInputProps()} />
          <p>{t('homePage.UploadImageMessage')}</p>
        </StyledDropZone>
      )}
      {file.preview && (
        <CardMedia component="img" image={file.preview} alt="green iguana" />
      )}
    </Card>
  );
}

export default ImageUploader;
