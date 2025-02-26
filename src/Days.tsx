import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from '@chakra-ui/react';
import { memo } from 'react';

import { ChangeSearchOption } from './types';
import { DAY_LABELS } from './constants';

type Props = {
  value: string[];
  changeSearchOption: ChangeSearchOption;
};

export const Days = memo(({ value, changeSearchOption }: Props) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(value) => changeSearchOption('days', value as string[])}
      >
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Day day={day} />
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

const Day = memo(
  ({ day }: { day: '월' | '화' | '수' | '목' | '금' | '토' }) => (
    <Checkbox key={day} value={day}>
      {day}
    </Checkbox>
  )
);
