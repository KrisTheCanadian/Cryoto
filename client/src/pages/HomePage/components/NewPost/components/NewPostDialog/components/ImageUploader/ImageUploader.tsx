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
import {BlobServiceClient} from '@azure/storage-blob';
import {v4 as uuidv4} from 'uuid';

interface FileToUpload {
  file: File | null;
  preview: string | null;
}

interface ImageUploaderProps {
  setFileUploadOpen: (fileUploadOpen: boolean) => void;
  setImageUrl: (imageUrl: string) => void;
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
  const {setFileUploadOpen, setImageUrl} = props;
  const [file, setFile] = useState<FileToUpload>({file: null, preview: null});
  const [imageName, setImageName] = useState<string>();
  const {t} = useTranslation();
  const SasURL = process.env.VITE_SAS_URL || '';
  const blobServiceClient = new BlobServiceClient(SasURL);
  // Get a reference to a container
  const containerClient = blobServiceClient.getContainerClient('post-images');

  const {getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setFile({
        file: acceptedFiles[0],
        preview: URL.createObjectURL(acceptedFiles[0]),
      });

      // Create a unique name for the blob
      const blobName = `${uuidv4() + acceptedFiles[0].name}`;

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      setImageUrl(blockBlobClient.url);
      setImageName(blobName);

      // Upload image to the blob
      await blockBlobClient.uploadData(acceptedFiles[0]);
    },
  });

  const handleRemoveImage = async () => {
    setFile({file: null, preview: null});
    setFileUploadOpen(false);

    const blockBlobClient = containerClient.getBlockBlobClient(imageName!);
    // Delete removed image
    await blockBlobClient.delete();
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
