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
  Box,
  Button,
  Checkbox,
  Typography,
  IconButton,
  FormHelperText,
  Grid
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

const CollectionCreate = ({ databaseId }) => {
  const isLoading = collectionStore.getIsLoading()
  const classes = useStyles()
  const { push } = useHistory()
  const initialValues = {
    name: '',
    displayName: '',
    description: '',
    schema: [
      {
        allowNull: true,
        name: '',
        type: ''
      }
    ]
  }

  const validationSchema = {
    name: Yup.string()
      .max(15)
      .matches(/^[a-zA-Z]*$/, 'Only alphabets are allowed!')
      .required('Required!'),
    displayName: Yup.string().required('Required!'),
    description: Yup.string(),
    schema: Yup.array(
      Yup.object({
        name: Yup.string()
          .matches(/^[a-zA-Z]*$/, 'Only alphabets are allowed!')
          .required('Required!'),
        type: Yup.string().required('Required!'),
        allowNull: Yup.boolean().required()
      })
    ).min(1)
  }

  const createCollectionForm = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({ ...validationSchema }),
    onSubmit: async (values) => {
      collectionStore.setIsLoading(true)
      const transformedSchema = {}
      values.schema.forEach((schemaObj) => {
        transformedSchema[`${schemaObj.name}`] = {
          ...schemaObj
        }
        delete transformedSchema[`${schemaObj.name}`]['name']
      })

      const transformedValues = {
        ...values,
        schema: transformedSchema,
        databaseId: databaseId
      }
      try {
        const response = await axiosMasterDataserviceInstance.post(
          '/collection/create',
          transformedValues
        )
        if (response && response.status === 200) {
          createCollectionForm.resetForm()
          push(`/data-sources/${databaseId}/collections`)
        }
        console.log(response)
      } catch (error) {
        console.log(error)
        collectionStore.setIsLoading(false)
      }
      collectionStore.setIsLoading(false)
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
          onBlur={async (e) => {
            const value = createCollectionForm.values.name
            const singularValue = singular(value)
            const singularCapitalize = capitalize(singularValue)
            await createCollectionForm.setFieldValue('name', singularCapitalize)
            createCollectionForm.setTouched({
              ...createCollectionForm.touched,
              name: true
            })
            createCollectionForm.handleChange('name')
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
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={
              createCollectionForm.dirty && !createCollectionForm.isValid
            }
          >
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
            onClick={async () => {
              const existingSchema = createCollectionForm.values.schema
              const updatedSchema = [
                ...existingSchema,
                {
                  name: '',
                  type: '',
                  allowNull: true
                }
              ]
              await createCollectionForm.setFieldValue('schema', updatedSchema)
            }}
          >
            Add new field
          </Button>
        </Box>

        {createCollectionForm.errors.schema &&
        typeof createCollectionForm.errors.schema !== 'object' ? (
          <Box>
            <FormHelperText>
              {createCollectionForm.errors.schema}
            </FormHelperText>
          </Box>
        ) : (
          ''
        )}

        <Typography>Required</Typography>
        {createCollectionForm.values.schema.map((schema, index) => {
          const currentSchemaField = createCollectionForm.values.schema[index]
          return (
            <Box key={index}>
              <Grid container spacing={2}>
                <Grid item xs={1}>
                  <Checkbox
                    color='primary'
                    checked={
                      createCollectionForm.values.schema[index].allowNull
                        ? false
                        : true
                    }
                    onClick={async (e) => {
                      currentSchemaField.allowNull = !e.target.checked
                      const updatedSchema = createCollectionForm.values.schema
                      updatedSchema[index] = currentSchemaField
                      await createCollectionForm.setFieldValue(
                        'schema',
                        updatedSchema
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    label='Collection field'
                    labelId='label-collection-field-id'
                    id='Collection Field'
                    variant='filled'
                    size='small'
                    name='description'
                    value={schema.name}
                    onChange={async (e) => {
                      currentSchemaField.name = e.target.value
                      const updatedSchema = createCollectionForm.values.schema
                      updatedSchema[index] = currentSchemaField
                      await createCollectionForm.setFieldValue(
                        'schema',
                        updatedSchema
                      )
                    }}
                    onBlur={async (e) => {
                      currentSchemaField.name = singular(
                        e.target.value.toLowerCase()
                      )
                      const updatedSchema = createCollectionForm.values.schema
                      updatedSchema[index] = currentSchemaField
                      await createCollectionForm.setFieldValue(
                        'schema',
                        updatedSchema
                      )
                      const touchedSchema = createCollectionForm.touched.schema
                        ? createCollectionForm.touched.schema
                        : []
                      const updatedTouchedScema = touchedSchema
                      updatedTouchedScema[index] = {
                        ...updatedTouchedScema[index],
                        name: true
                      }
                      createCollectionForm.setTouched({
                        ...createCollectionForm.touched,
                        schema: updatedTouchedScema
                      })
                      createCollectionForm.handleBlur('schema')
                    }}
                    helperText={
                      createCollectionForm.errors.schema &&
                      createCollectionForm.touched.schema &&
                      createCollectionForm.errors.schema[index] &&
                      createCollectionForm.touched.schema[index] &&
                      createCollectionForm.errors.schema[index]['name'] &&
                      createCollectionForm.touched.schema[index]['name']
                        ? createCollectionForm.errors.schema[index]['name']
                        : ''
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth variant='filled' size='small'>
                    <InputLabel id='label-type-id'>Type</InputLabel>
                    <Select
                      labelId='label-type-id'
                      id='type'
                      name='type'
                      value={schema.type}
                      onChange={async (e) => {
                        currentSchemaField.type = e.target.value
                        const updatedSchema = createCollectionForm.values.schema
                        updatedSchema[index] = currentSchemaField
                        await createCollectionForm.setFieldValue(
                          'schema',
                          updatedSchema
                        )
                      }}
                      onBlur={(e) => {
                        const touchedSchema = createCollectionForm.touched
                          .schema
                          ? createCollectionForm.touched.schema
                          : []
                        const updatedTouchedScema = touchedSchema
                        updatedTouchedScema[index] = {
                          ...updatedTouchedScema[index],
                          type: true
                        }
                        createCollectionForm.setTouched({
                          ...createCollectionForm.touched,
                          schema: updatedTouchedScema
                        })
                        createCollectionForm.handleBlur('schema')
                      }}
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
                    {createCollectionForm.errors.schema &&
                    createCollectionForm.touched.schema &&
                    createCollectionForm.errors.schema[index] &&
                    createCollectionForm.touched.schema[index] &&
                    createCollectionForm.errors.schema[index]['type'] &&
                    createCollectionForm.touched.schema[index]['type'] ? (
                      <FormHelperText>
                        {createCollectionForm.errors.schema[index]['type']}
                      </FormHelperText>
                    ) : (
                      ''
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={1} style={{ color: 'red' }}>
                  <IconButton
                    color='inherit'
                    onClick={async () => {
                      const existingSchema = createCollectionForm.values.schema
                      const updatedSchema = existingSchema
                      updatedSchema.splice(index, 1)
                      await createCollectionForm.setFieldValue(
                        'schema',
                        updatedSchema
                      )
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          )
        })}
      </form>
    </Container>
  )
}

export default observer(CollectionCreate)
