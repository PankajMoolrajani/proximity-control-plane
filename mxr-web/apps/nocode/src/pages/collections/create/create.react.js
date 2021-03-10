import React from 'react'
import { useFormik } from 'formik'
import { observer } from 'mobx-react-lite'
import { useHistory } from 'react-router-dom'
import { axiosMasterDataserviceInstance } from '../../../libs/axios/axios'
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container,
  Divider,
  Box,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton
} from '@material-ui/core'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'
import { singular } from 'pluralize'
import Loader from '../../../components/Loader'
import { capitalize } from '../../../libs/helpers/helper.lib'
import collectionStore from '../../../store/collection.store'

const useStyles = makeStyles((theme) => ({
  fields: {
    marginTop: theme.spacing(2)
  }
}))

const CollectionCreate = () => {
  const isLoading = collectionStore.getIsLoading()
  const classes = useStyles()
  const initialValues = {
    name: '',
    displayName: '',
    description: '',
    schema: []
  }

  const validationSchema = {
    name: Yup.string()
      .max(15)
      .matches(/^[a-zA-Z]*$/, 'Only alphabets are allowed!')
      .required('Required!'),
    displayName: Yup.string().required('Required!'),
    description: Yup.string(),
    schema: Yup.array().required()
  }

  const createCollectionForm = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({ ...validationSchema }),
    onSubmit: (values) => {
      alert(JSON.stringify(values))
    }
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <Container maxWidth='sm' style={{ marginLeft: 0 }}>
      <form onSubmit={createCollectionForm.handleSubmit} autoComplete='off'>
        <TextField
          fullWidth
          label='Name'
          labelId='label-name-id'
          id='name'
          variant='filled'
          size='small'
          name='name'
          value={createCollectionForm.values.name}
          onChange={createCollectionForm.handleChange}
          onBlur={(e) => {
            const value = createCollectionForm.values.name
            const singularValue = singular(value)
            const singularCapitalize = capitalize(singularValue)
            createCollectionForm.setFieldValue('name', singularCapitalize)
            createCollectionForm.handleBlur('name')
          }}
          error={
            createCollectionForm.errors.name &&
            Boolean(createCollectionForm.touched.name)
          }
          helperText={
            createCollectionForm.touched.name &&
            createCollectionForm.errors.name
          }
        />
        <TextField
          fullWidth
          label='Display Name'
          labelId='label-display-name-id'
          id='displayName'
          variant='filled'
          size='small'
          name='displayName'
          value={createCollectionForm.values.displayName}
          onChange={createCollectionForm.handleChange}
          onBlur={createCollectionForm.handleBlur}
          error={
            createCollectionForm.errors.displayName &&
            Boolean(createCollectionForm.touched.displayName)
          }
          helperText={
            createCollectionForm.touched.displayName &&
            createCollectionForm.errors.displayName
          }
          className={classes.fields}
        />
        <TextField
          fullWidth
          label='Description'
          labelId='label-description-name-id'
          id='description'
          variant='filled'
          size='small'
          name='description'
          value={createCollectionForm.values.description}
          onChange={createCollectionForm.handleChange}
          onBlur={createCollectionForm.handleBlur}
          error={
            createCollectionForm.errors.description &&
            Boolean(createCollectionForm.touched.description)
          }
          helperText={
            createCollectionForm.touched.description &&
            createCollectionForm.errors.description
          }
          className={classes.fields}
        />

        <Box mt={2}>
          <Button type='submit' variant='contained' color='primary'>
            Create
          </Button>
        </Box>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mt={2}
          color='black'
        >
          <Typography>COLLECTION FIELDS</Typography>
          <Button
            variant='text'
            color='primary'
            onClick={() => {
              const existingSchema = createCollectionForm.values.schema
              const updatedSchema = [
                ...existingSchema,
                {
                  name: '',
                  type: '',
                  allowNull: true
                }
              ]
              createCollectionForm.setFieldValue('schema', updatedSchema)
            }}
          >
            Add new field
          </Button>
        </Box>
        <Typography>Required</Typography>
        {createCollectionForm.values.schema.map((schema, index) => {
          const currentSchemaField = createCollectionForm.values.schema[index]
          return (
            <Box
              display='flex'
              key={index}
              mt={2}
              justifyContent='space-between'
            >
              <Box>
                <Checkbox
                  color='primary'
                  checked={
                    createCollectionForm.values.schema[index].allowNull
                      ? false
                      : true
                  }
                  onClick={(e) => {
                    currentSchemaField.allowNull = !e.target.checked
                    const updatedSchema = createCollectionForm.values.schema
                    updatedSchema[index] = currentSchemaField
                    createCollectionForm.setFieldValue('schema', updatedSchema)
                  }}
                />
              </Box>
              <Box flex={5} mx={2}>
                <TextField
                  fullWidth
                  label='Collection field'
                  labelId='label-collection-field-id'
                  id='Collection Field'
                  variant='filled'
                  size='small'
                  name='description'
                  value={schema.name}
                  onChange={(e) => {}}
                />
              </Box>
              <Box flex={2} mx={2}>
                <FormControl fullWidth variant='filled' size='small'>
                  <InputLabel id='label-type-id'>Type</InputLabel>
                  <Select
                    labelId='label-dialect-id'
                    id='dialect'
                    label='Type'
                    name='dialect'
                    value={schema.type}
                    onChange={() => {}}
                  >
                    <MenuItem value='uuid'>UUID</MenuItem>
                    <MenuItem value='string'>String</MenuItem>
                    <MenuItem value='text'>Text</MenuItem>
                    <MenuItem value='integer'>Integer</MenuItem>
                    <MenuItem value='big-integer'>Big Integer</MenuItem>
                    <MenuItem value='double'>Double</MenuItem>
                    <MenuItem value='datetime'>DateTime</MenuItem>
                    <MenuItem value='date'>Date</MenuItem>
                    <MenuItem value='boolean'>Boolean</MenuItem>
                    <MenuItem value='json'>JSON</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box color='red'>
                <IconButton
                  color='inherit'
                  onClick={() => {
                    const existingSchema = createCollectionForm.values.schema
                    const updatedSchema = existingSchema
                    updatedSchema.splice(index, 1)
                    createCollectionForm.setFieldValue('schema', updatedSchema)
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            </Box>
          )
        })}
      </form>
    </Container>
  )
}

export default observer(CollectionCreate)
