import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {useTranslation} from 'react-i18next';

function Settings() {
  const rightBarContent = 'Settings Route';
  const {t, i18n} = useTranslation();
  const handleChange = (event: SelectChangeEvent<string>) => {
    i18n.changeLanguage(event.target.value);
  };
  return (
    <PageFrame>
      <FullWidthColumn>
        <Box>{rightBarContent}</Box>

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
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Settings;
