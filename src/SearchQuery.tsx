import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { ChangeSearchOption } from './types';

type Props = {
  value?: string;
  changeSearchOption: ChangeSearchOption;
};

export const SearchQuery = ({ value, changeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => changeSearchOption('query', e.target.value)}
      />
    </FormControl>
  );
};
