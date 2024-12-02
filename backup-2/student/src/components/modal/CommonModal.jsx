import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Image,
  Box,
  Grid,
  GridItem,
  Checkbox,
  Flex,
  Text
} from '@chakra-ui/react';
import { IoCloudUploadOutline } from "react-icons/io5";
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import SubmitButton from '../button/SubmitButton';
import TextBox from '../textbox/TextBox';
import { MdDelete } from 'react-icons/md';
import OnClickButton from "../../components/button/OnClickButton"
import AlertBox from '../alert/Alert';

function CustomModal({
  open,
  handleClose,
  title,
  fields,
  onConfirm,
  onAddOption,
  onRemoveOption,
  transformValues,
  buttonLabel,
  children,
  boolean,
  validationSchema,
  initialValues,
  correctAnswer,
  setCorrectAnswer,
  defaultValues,
  error,
  clearMessage
}) {


  const handleCheckboxChange = (event, option) => {
    const { checked } = event.target;

    if (checked) {
      setCorrectAnswer((prevCorrectAnswer) => [...prevCorrectAnswer, option]);
    } else {
      setCorrectAnswer((prevCorrectAnswer) =>
        prevCorrectAnswer.filter((answer) => answer !== option)
      );
    }
  };

  if (!initialValues) {
    initialValues = fields?.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {});
  }

  const handleCloseModal = () => {
    handleClose();
  };

  const handleSubmit = (values) => {
    const transformedValues = transformValues ? transformValues(values) : values;
    onConfirm(transformedValues);
    handleCloseModal();
  };
  const renderField = (field, values, setFieldValue) => {
    const isOptionField = field.name.startsWith('option');

    return (
      <Field name={field.name}>
        {({ field: formikField, meta, form }) => (
          <FormControl isInvalid={meta.touched && meta.error}>
            {field.type === 'file' ? (
              <>
                {values[formikField.name] instanceof File ? (
                  <Box mb={4}>
                    <Image
                      src={URL.createObjectURL(values[formikField.name])}
                      alt={field.label}
                      width="100%"
                      maxHeight="200px"
                      objectFit="cover"
                    />
                  </Box>
                ) : values[formikField.name] && typeof values[formikField.name] === 'string' ? (
                  <Box mb={4}>
                    <Image
                      src={values[formikField.name]} // Directly use the URL
                      alt={field.label}
                      width="100%"
                      maxHeight="200px"
                      objectFit="cover"
                    />
                  </Box>
                ) : null}
                {values[formikField.name] instanceof File && (
                  <Text mb={2}>{values[formikField.name].name}</Text>
                )}
                <Button
                  as="label"
                  variant="solid"
                  bg="blue.500"
                  color="white"
                  width="100%"
                  _hover={{ bg: "blue.600" }}
                  mt={4}
                  leftIcon={<IoCloudUploadOutline />}
                >
                  {field.label}
                  <Input
                    type="file"
                    hidden
                    onChange={(event) => setFieldValue(formikField.name, event.target.files[0])}
                  />
                </Button>
                {meta.touched && meta.error && (
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                )}
              </>
            ) : (
              <>
                <FormLabel>{field.label}</FormLabel>

                {isOptionField ? (
                  <Flex align="center" gap={2}>
                    <TextBox
                      field={formikField}
                      form={form}
                      type={field.type}
                      placeholder={field.placeholder}
                      icon={field.icon}
                      isPasswordField={field.isPasswordField}
                      width={field.width}
                      borderRadius={field.borderRadius}
                      backgroundColor={field.backgroundColor}
                      boxShadow={field.boxShadow}
                    />
                    <Checkbox
                      onChange={(e) => handleCheckboxChange(e, formikField.value)}
                      isChecked={field.checked || correctAnswer.includes(formikField.value)}
                    />
                    {boolean && (
                      <MdDelete onClick={onRemoveOption} />
                    )}
                  </Flex>
                ) : (
                  <>
                    {field.componentType === 'select' ? (
                      React.cloneElement(field.component, {
                        optionValue: values[field.name],
                        onSelect: (option) => setFieldValue(field.name, option.id),
                      })
                    ) : field.componentType === 'button' ? (
                      React.cloneElement(field.component)
                    ) : (
                      <TextBox
                        field={formikField}
                        form={form}
                        type={field.type}
                        title={field.name}
                        placeholder={field.placeholder}
                        icon={field.icon}
                        isPasswordField={field.isPasswordField}
                        width={field.width}
                        borderRadius={field.borderRadius}
                        backgroundColor={field.backgroundColor}
                        boxShadow={field.boxShadow}
                      />
                    )}
                  </>
                )}

                {meta.touched && meta.error && (
                  <FormErrorMessage>{meta.error}</FormErrorMessage>
                )}
              </>
            )}
          </FormControl>
        )}
      </Field>
    );
  };

  return (
    <Modal isOpen={open} onClose={handleCloseModal} isCentered defaultValue={defaultValues} data-testid="modal" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxWidth={{ base: "100vw", md: "30vw" }}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        {error && (
          <AlertBox message={error} onClose={clearMessage} />
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => {
            return (
              <Form>
                <Box ml={{ base: '50px', md: '50px' }}>{children}</Box>
                <ModalBody px="3rem">
                  <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    {fields.map((field) => (
                      <GridItem key={field.name} colSpan={2}>
                        {renderField(field, values, setFieldValue)}
                      </GridItem>
                    ))}
                  </Grid>
                  {boolean && (
                    <Button mt={4} colorScheme="teal" onClick={onAddOption}>
                      + Add Option
                    </Button>
                  )}
                </ModalBody>
                <ModalFooter>
                  <SubmitButton label={buttonLabel} colorScheme={"green"} _hover={{ bg: "green" }} type="submit" title={buttonLabel} data-testid="submit" /> &nbsp;
                  <OnClickButton onClick={handleCloseModal} colorScheme="red" _hover={{ bg: "red" }} title="Cancel" label="Cancel" />
                </ModalFooter>
              </Form>
            )
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
}

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
  })).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onAddOption: PropTypes.func,
  onRemoveOption: PropTypes.func,
  transformValues: PropTypes.func,
  children: PropTypes.node,
  error: PropTypes.string,
  correctAnswer: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCorrectAnswer: PropTypes.func.isRequired,
  defaultValues: PropTypes.object,
  boolean: PropTypes.bool,
  validationSchema: PropTypes.object,
  initialValues: PropTypes.object,
  clearMessage: PropTypes.string,
};

export default CustomModal;