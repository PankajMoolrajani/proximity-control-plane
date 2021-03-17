import { useEffect } from 'react'
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
  Button
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'
import { singular } from 'pluralize'
import Loader from '../../../components/Loader'
import { capitalize } from '../../../libs/helpers/helper.lib'
import collectionStore from '../../../store/collection.store'
import relationStore from '../../../store/relation.store'

const useStyles = makeStyles((theme) => ({
  fields: {
    marginTop: theme.spacing(2)
  }
}))

const RelationCreate = ({ databaseId }) => {
  const isRelationLoading = relationStore.getIsLoading()
  const classes = useStyles()
  const { push } = useHistory()
  const collections = collectionStore.getCollections()
  const isCollectionLoading = collectionStore.getIsLoading()

  const fetchCollections = async () => {
    const query = collectionStore.getQuery()
    collectionStore.setIsLoading(true)
    try {
      const response = await axiosMasterDataserviceInstance.post(
        '/collection/search',
        {
          query: query,
          databaseId: databaseId
        }
      )
      if (response && response.status === 200) {
        collectionStore.setCollections(response.data.rows)
        collectionStore.setTotal(response.data.count)
      }
    } catch (error) {
      console.log(error)
    }
    collectionStore.setIsLoading(false)
  }

  useEffect(() => {
    collectionStore.setQuery({
      limit: 100,
      offset: 0,
      where: {
        DatabaseId: databaseId
      }
    })
    fetchCollections()
  }, [databaseId])

  const initialValues = {
    name: '',
    displayName: '',
    description: '',
    sourceCollection: '',
    targetCollection: '',
    type: '',
    option: {}
  }

  const validationSchema = {
    name: Yup.string()
      .max(15)
      .matches(/^[a-zA-Z]*$/, 'Only alphabets are allowed!')
      .required('Required!'),
    displayName: Yup.string().required('Required!'),
    description: Yup.string(),
    sourceCollection: Yup.object().required('Required!'),
    targetCollection: Yup.object().required('Required!'),
    type: Yup.string().required('Required!'),
    option: Yup.object()
  }

  const createRelationForm = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({ ...validationSchema }),
    onSubmit: async (values) => {
      // relationStore.setIsLoading(true)
      // try {
      //   const response = await axiosMasterDataserviceInstance.post(
      //     '/collection/relation/create',
      //     values
      //   )
      //   if (response && response.status === 200) {
      //     createRelationForm.resetForm()
      //     push(`/data-sources/${databaseId}/relations`)
      //   }
      //   console.log(response)
      // } catch (error) {
      //   console.log(error)
      //   relationStore.setIsLoading(false)
      // }
      // relationStore.setIsLoading(false)
    }
  })

  if (isCollectionLoading || isRelationLoading) {
    return <Loader />
  }
  return (
    <Container maxWidth='sm' style={{ marginLeft: 0 }}>
      <form onSubmit={createRelationForm.handleSubmit} autoComplete='off'>
        <TextField
          fullWidth
          label='Name'
          labelId='label-name-id'
          id='name'
          variant='filled'
          size='small'
          name='name'
          value={createRelationForm.values.name}
          onChange={createRelationForm.handleChange}
          onBlur={async (e) => {
            const value = createRelationForm.values.name
            const singularValue = singular(value)
            const singularCapitalize = capitalize(singularValue)
            await createRelationForm.setFieldValue('name', singularCapitalize)
            createRelationForm.setTouched({
              ...createRelationForm.touched,
              name: true
            })
            createRelationForm.handleChange('name')
            createRelationForm.handleBlur('name')
          }}
          error={
            createRelationForm.errors.name &&
            Boolean(createRelationForm.touched.name)
          }
          helperText={
            createRelationForm.touched.name && createRelationForm.errors.name
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
          value={createRelationForm.values.displayName}
          onChange={createRelationForm.handleChange}
          onBlur={createRelationForm.handleBlur}
          error={
            createRelationForm.errors.displayName &&
            Boolean(createRelationForm.touched.displayName)
          }
          helperText={
            createRelationForm.touched.displayName &&
            createRelationForm.errors.displayName
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
          value={createRelationForm.values.description}
          onChange={createRelationForm.handleChange}
          onBlur={createRelationForm.handleBlur}
          error={
            createRelationForm.errors.description &&
            Boolean(createRelationForm.touched.description)
          }
          helperText={
            createRelationForm.touched.description &&
            createRelationForm.errors.description
          }
          className={classes.fields}
        />
        <FormControl
          fullWidth
          variant='filled'
          size='small'
          error={
            createRelationForm.errors.sourceCollection &&
            Boolean(createRelationForm.touched.sourceCollection)
          }
          helperText={
            createRelationForm.touched.sourceCollection &&
            createRelationForm.errors.sourceCollection
          }
          className={classes.fields}
        >
          <InputLabel id='label-sourceCollectionId-id'>
            Source Collection
          </InputLabel>
          <Select
            labelId='label-sourceCollection-id'
            id='sourceCollection'
            label='Source Collection'
            name='sourceCollection'
            value={createRelationForm.values.sourceCollection}
            onChange={createRelationForm.handleChange}
            onBlur={createRelationForm.handleBlur}
            renderValue={(collection) => {
              console.log(collection)
              return collection.displayName
            }}
          >
            {collections.map((collection) => (
              <MenuItem value={collection}>{collection.displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          variant='filled'
          size='small'
          error={
            createRelationForm.errors.type &&
            Boolean(createRelationForm.touched.type)
          }
          helperText={
            createRelationForm.touched.type && createRelationForm.errors.type
          }
          className={classes.fields}
        >
          <InputLabel id='label-type-id'>Relation Type</InputLabel>
          <Select
            labelId='label-type-id'
            id='type'
            name='type'
            value={createRelationForm.values.type}
            onChange={createRelationForm.handleChange}
            onBlur={createRelationForm.handleBlur}
          >
            <MenuItem value='hasOne'>Has one</MenuItem>
            <MenuItem value='hasMany'>Has Many</MenuItem>
            <MenuItem value='belongsTo'>Belongs To</MenuItem>
            <MenuItem value='manyToMany'>Many to Many</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          fullWidth
          variant='filled'
          size='small'
          error={
            createRelationForm.errors.targetCollection &&
            Boolean(createRelationForm.touched.targetCollection)
          }
          helperText={
            createRelationForm.touched.targetCollection &&
            createRelationForm.errors.targetCollection
          }
          className={classes.fields}
        >
          <InputLabel id='label-targetCollection-id'>
            Target Collection
          </InputLabel>
          <Select
            labelId='label-targetCollection-id'
            id='targetCollection'
            label='Target Collection'
            name='targetCollection'
            value={createRelationForm.values.targetCollection}
            onChange={createRelationForm.handleChange}
            onBlur={createRelationForm.handleBlur}
            renderValue={(collection) => {
              console.log(collection)
              return collection.displayName
            }}
          >
            {collections.map((collection) => (
              <MenuItem value={collection}>{collection.displayName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={createRelationForm.dirty && !createRelationForm.isValid}
          >
            Create
          </Button>
        </Box>
      </form>
    </Container>
  )
}

export default observer(RelationCreate)
