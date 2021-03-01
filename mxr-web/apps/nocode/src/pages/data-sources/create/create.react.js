import { Fragment, useState, useEffect } from 'react'
import { useFormik } from 'formik'
import {
  Typography,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container,
  Divider,
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import * as Yup from 'yup'

const useStyles = makeStyles((theme) => ({
  fields: {
    marginTop: theme.spacing(2)
  }
}))

const Create = () => {
  const classes = useStyles()
  let initialValues = {
    name: '',
    displayName: '',
    description: '',
    databaseName: '',
    provider: 'MONOXOR',
    dialect: 'postgres',
    host: '',
    port: null,
    username: '',
    password: ''
  }

  let validationSchema = {
    name: Yup.string().required('Required!'),
    displayName: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    databaseName: Yup.string()
      .matches(
        /^[a-z]*$/,
        'Invalid databasename format(ex. order-items)'
      )
      .required('Required!'),
    provider: Yup.string().oneOf(['MONOXOR', 'EXTERNAL']).required('Required!'),
    dialect: Yup.string().when('provider', {
      is: (provider) => provider === 'EXTERNAL',
      then: Yup.string()
        .oneOf(['mysql', 'postgres', 'mariadb', 'mongodb'])
        .required('Required!')
    }),
    host: Yup.string().when('provider', {
      is: (provider) => provider === 'EXTERNAL',
      then: Yup.string().required('Required!')
    }),
    port: Yup.mixed().when('provider', {
      is: (provider) => provider === 'EXTERNAL',
      then: Yup.number().integer().required('Required!')
    }),
    username: Yup.string().when('provider', {
      is: (provider) => provider === 'EXTERNAL',
      then: Yup.string().required('Required!')
    }),
    password: Yup.string().when('provider', {
      is: (provider) => provider === 'EXTERNAL',
      then: Yup.string().required('Required!')
    })
  }

  const createDatabaseForm = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({ ...validationSchema }),
    onSubmit: (values) => {
      alert(JSON.stringify(values))
    },
    enableReinitialize: true
  })
  return (
    <Container maxWidth='sm' style={{ marginLeft: 0 }}>
      <form onSubmit={createDatabaseForm.handleSubmit} autoComplete='off'>
        <TextField
          fullWidth
          label='Name'
          labelId='label-name-id'
          id='name'
          variant='filled'
          size='small'
          name='name'
          value={createDatabaseForm.values.name}
          onChange={createDatabaseForm.handleChange}
          onBlur={createDatabaseForm.handleBlur}
          error={
            createDatabaseForm.errors.name &&
            Boolean(createDatabaseForm.touched.name)
          }
          helperText={
            createDatabaseForm.touched.name && createDatabaseForm.errors.name
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
          value={createDatabaseForm.values.displayName}
          onChange={createDatabaseForm.handleChange}
          onBlur={createDatabaseForm.handleBlur}
          error={
            createDatabaseForm.errors.displayName &&
            Boolean(createDatabaseForm.touched.displayName)
          }
          helperText={
            createDatabaseForm.touched.displayName &&
            createDatabaseForm.errors.displayName
          }
          className={classes.fields}
        />
        <TextField
          fullWidth
          label='Description'
          labelId='label-description-id'
          id='description'
          variant='filled'
          size='small'
          name='description'
          value={createDatabaseForm.values.description}
          onChange={createDatabaseForm.handleChange}
          onBlur={createDatabaseForm.handleBlur}
          error={
            createDatabaseForm.errors.description &&
            Boolean(createDatabaseForm.touched.description)
          }
          helperText={
            createDatabaseForm.touched.description &&
            createDatabaseForm.errors.description
          }
          multiline
          rowsMax={2}
          className={classes.fields}
        />
        <TextField
          fullWidth
          label='Database Name'
          labelId='label-database-name-id'
          id='databaseName'
          variant='filled'
          size='small'
          name='databaseName'
          value={createDatabaseForm.values.databaseName}
          onChange={createDatabaseForm.handleChange}
          onBlur={createDatabaseForm.handleBlur}
          error={
            createDatabaseForm.errors.databaseName &&
            Boolean(createDatabaseForm.touched.databaseName)
          }
          helperText={
            createDatabaseForm.touched.databaseName &&
            createDatabaseForm.errors.databaseName
          }
          className={classes.fields}
        />
        <FormControlLabel
          control={
            <Checkbox
              color='primary'
              checked={
                createDatabaseForm.values.provider === 'EXTERNAL' ? true : false
              }
              onChange={(e) => {
                const formikProvider = e.target.checked ? 'EXTERNAL' : 'MONOXOR'
                createDatabaseForm.setFieldValue('provider', formikProvider)
              }}
              name='provider'
            />
          }
          label='Use remote database'
          className={classes.fields}
        />
        {createDatabaseForm.values.provider === 'EXTERNAL' ? (
          <Fragment>
            <FormControl
              fullWidth
              variant='filled'
              size='small'
              error={
                createDatabaseForm.errors.dialect &&
                Boolean(createDatabaseForm.touched.dialect)
              }
              helperText={
                createDatabaseForm.touched.dialect &&
                createDatabaseForm.errors.dialect
              }
            >
              <InputLabel id='label-dialect-id'>Type</InputLabel>
              <Select
                labelId='label-dialect-id'
                id='dialect'
                label='Type'
                name='dialect'
                value={createDatabaseForm.values.dialect}
                onChange={createDatabaseForm.handleChange}
                onBlur={createDatabaseForm.handleBlur}
              >
                <MenuItem value='mysql'>MySQL</MenuItem>
                <MenuItem value='postgres'>PostgreSQL</MenuItem>
                <MenuItem value='mariadb'>MariaDB</MenuItem>
                <MenuItem value='mongodb'>MongoDB</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label='Host'
              labelId='label-host-id'
              id='host'
              variant='filled'
              size='small'
              name='host'
              value={createDatabaseForm.values.host}
              onChange={createDatabaseForm.handleChange}
              onBlur={createDatabaseForm.handleBlur}
              error={
                createDatabaseForm.errors.host &&
                Boolean(createDatabaseForm.touched.host)
              }
              helperText={
                createDatabaseForm.touched.host &&
                createDatabaseForm.errors.host
              }
              className={classes.fields}
            />
            <TextField
              fullWidth
              label='Port'
              labelId='label-port-id'
              id='port'
              variant='filled'
              size='small'
              name='port'
              value={createDatabaseForm.values.port}
              onChange={createDatabaseForm.handleChange}
              onBlur={createDatabaseForm.handleBlur}
              error={
                createDatabaseForm.errors.port &&
                Boolean(createDatabaseForm.touched.port)
              }
              helperText={
                createDatabaseForm.touched.port &&
                createDatabaseForm.errors.port
              }
              className={classes.fields}
            />
            <TextField
              fullWidth
              label='User Name'
              labelId='label-username-id'
              id='username'
              variant='filled'
              size='small'
              name='username'
              value={createDatabaseForm.values.username}
              onChange={createDatabaseForm.handleChange}
              onBlur={createDatabaseForm.handleBlur}
              error={
                createDatabaseForm.errors.username &&
                Boolean(createDatabaseForm.touched.username)
              }
              helperText={
                createDatabaseForm.touched.username &&
                createDatabaseForm.errors.username
              }
              className={classes.fields}
            />
            <TextField
              fullWidth
              label='Password'
              labelId='label-password-id'
              id='password'
              variant='filled'
              size='small'
              name='password'
              type='password'
              value={createDatabaseForm.values.password}
              onChange={createDatabaseForm.handleChange}
              onBlur={createDatabaseForm.handleBlur}
              error={
                createDatabaseForm.errors.password &&
                Boolean(createDatabaseForm.touched.password)
              }
              helperText={
                createDatabaseForm.touched.password &&
                createDatabaseForm.errors.password
              }
              className={classes.fields}
            />
          </Fragment>
        ) : (
          ''
        )}

        <Divider style={{ margin: '20px 0' }} />
        <Box>
          <Button
            color='primary'
            variant='contained'
            style={{ marginRight: 8 }}
            type='submit'
            disabled={!createDatabaseForm.isValid}
          >
            Create
          </Button>
          {createDatabaseForm.values.provider === 'EXTERNAL' ? (
            <Button color='primary' variant='outlined'>
              Test Connection
            </Button>
          ) : null}
        </Box>
      </form>
    </Container>
  )
}

export default Create
