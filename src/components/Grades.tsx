import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from '@chakra-ui/react';
import { memo } from 'react';
import { ChangeSearchOption } from './types/types';

type Props = {
  value: number[];
  changeSearchOption: ChangeSearchOption;
};

export const Grades = memo(({ value, changeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(value) => changeSearchOption('grades', value.map(Number))}
      >
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Grade grade={grade} key={grade} />
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

const Grade = memo(({ grade }: { grade: number }) => (
  <Checkbox value={grade}>{grade}학년</Checkbox>
));
