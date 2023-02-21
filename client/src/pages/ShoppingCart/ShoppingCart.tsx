import {Box} from '@mui/material';
import PageFrame from '@shared/components/PageFrame';
import {motion} from 'framer-motion';

import {Cart} from './components';

function ShoppingCart() {
  return (
    <PageFrame>
      <Box flex={8} p={0} sx={{ml: '0!important'}}>
        <Box p={2} display="flex">
          <motion.div
            animate={{opacity: 1, y: 0}}
            initial={{y: -50}}
            transition={{duration: 0.5}}
            style={{position: 'relative', width: '100%'}}
          >
            <Box sx={{position: 'absolute', left: 0, width: '100%'}}>
              <Cart checkout={false} />
            </Box>
          </motion.div>
        </Box>
      </Box>
    </PageFrame>
  );
}

export default ShoppingCart;
