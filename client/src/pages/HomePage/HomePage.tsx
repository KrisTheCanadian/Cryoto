import {MiddleColumn} from '@shared/components/MiddleColumn';
import {RightBar} from '@shared/components/RightBar';

import {Post} from './components';

function HomePage() {
  const samplePostProps = {
    firstName: 'Graeme Killick',
    recipient: 'Martin',
    coinsGiven: 100,
    tags: ['Teamwork'],
    message: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet nunc eget lectus tincidunt bibendum ut non lacus. Quisque bibendum risus sapien, vitae facilisis metus imperdiet id. Sed sed eros orci. Nullam condimentum sem nec neque vehicula commodo. Mauris sed nibh aliquet, volutpat turpis nec, porta ante. Cras eu mollis nunc. 
    `,
    date: 'September 14, 2016',
  };
  const rightBarContent = 'Right bar content';
  return (
    <>
      <MiddleColumn>
        <Post {...samplePostProps} />
        <Post
          {...samplePostProps}
          imageURL="https://images.pexels.com/photos/1242348/pexels-photo-1242348.jpeg"
        />
        <Post {...samplePostProps} />
        <Post {...samplePostProps} />
        <Post {...samplePostProps} />
        <Post {...samplePostProps} />
      </MiddleColumn>
      <RightBar>{rightBarContent}</RightBar>
    </>
  );
}

export default HomePage;
