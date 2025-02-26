import {
  FormControl,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
} from '@chakra-ui/react';
import { memo } from 'react';
import { DAY_LABELS } from '../constants/constants';
import { ChangeSearchOption } from '../types/types';

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
        onChange={(value) => {
          console.log(value);
          changeSearchOption('days', value as string[]);
        }}
      >
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Day day={day} key={day} />
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

const Day = memo(
  ({ day }: { day: '월' | '화' | '수' | '목' | '금' | '토' }) => (
    <Checkbox value={day}>{day}</Checkbox>
  )
);
