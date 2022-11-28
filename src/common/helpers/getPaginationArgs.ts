import { PaginationArgs } from '../pagination/pagination.input';

const getPaginationArgs = (
  pg: PaginationArgs | null
): { skip: number; take: number } => {
  let page = pg?.page || 1;
  const take = pg?.pageSize || 10;

  if (page < 1) page = 1;
  const skip = (page - 1) * take;

  return {
    skip,
    take,
  };
};

export default getPaginationArgs;
