import {SxProps, Theme} from '@mui/material';

const extractInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0);
  }
  return names[0].charAt(0) + names[names.length - 1].charAt(0);
};

export const stringAvatar = (name: string, sx: SxProps<Theme> = {}) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...sx,
    },
    children: extractInitials(name),
  };
};

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};
