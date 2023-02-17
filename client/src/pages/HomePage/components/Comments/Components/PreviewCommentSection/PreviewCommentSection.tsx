import {List} from '@mui/material';

import CommentHolder from '../CommentHolder';

import IComment from '@/data/api/types/IComment';

interface PreviewCommentSectionSectionProps {
  id: string;
  max: number;
  postId: string;
  comments: IComment[];
  showAllComments: boolean;
}

const PreviewCommentSection = (props: PreviewCommentSectionSectionProps) => {
  const commentList = props.showAllComments
    ? props.comments
    : props.comments.slice(0, props.max);
  return (
    <>
      <List sx={{paddingTop: 0}}>
        {commentList.map((comment) => {
          return (
            <CommentHolder
              key={`${props.postId}-${comment.id}`}
              comment={comment}
              id={props.id}
            />
          );
        })}
      </List>
    </>
  );
};

export default PreviewCommentSection;
