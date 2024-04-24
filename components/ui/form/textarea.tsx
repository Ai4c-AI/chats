import { FormControl, FormItem, FormLabel, FormMessage } from '../form';
import { Textarea } from '../textarea';
import { FormFieldType, IFormFieldOption } from './type';

const FormTextarea = ({
  label,
  options,
  field,
  hidden,
  rows,
}: {
  label?: string;
  options?: IFormFieldOption;
  field: FormFieldType;
  hidden?: boolean;
  rows?: number;
}) => {
  return (
    <FormItem className='py-2' hidden={hidden}>
      <FormLabel>{options?.label || label}</FormLabel>
      <FormControl>
        <Textarea rows={rows} placeholder={options?.placeholder} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default FormTextarea;
