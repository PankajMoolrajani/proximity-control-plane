import { Fragment } from 'react'
import { useFormik } from 'formik'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import * as Yup from 'yup'

const Create = () => {
  const {
    values: dataValues,
    isValid,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useFormik({
    initialValues: {
      location: '',
      host: '',
      port: '',
      database: '',
      dialect: '',
      username: '',
      password: ''
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .oneOf(['INTERNAL', 'EXTERNAL'], 'It should be INTERNAL or EXTERNAL')
        .required('Database name required!'),
      host: Yup.string().when('location', {
        is: (location) => location === 'EXTERNAL',
        then: Yup.string().required('Host is required!')
      }),
      port: Yup.number().when('location', {
        is: (location) => location === 'EXTERNAL',
        then: Yup.number().required('Port is required!')
      }),
      database: Yup.string()
        .matches(
          /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
          'Invalid databasename format(ex. order-items)'
        )
        .required('Database is required'),
      dialect: Yup.string()
        .when('location', {
          is: (location) => location === 'EXTERNAL',
          then: Yup.string().required('Dialect is required!')
        })
        .oneOf(['MYSQL', 'POSTGRES', 'MONGODB']),
      username: Yup.string().when('location', {
        is: (location) => location === 'EXTERNAL',
        then: Yup.string().required('Username is required!')
      }),
      password: Yup.string().when('location', {
        is: (location) => location === 'EXTERNAL',
        then: Yup.string().required('Password is required!')
      })
    }),
    onSubmit: (values) => {
      alert(JSON.stringify(values))
    }
  })
  console.log(errors, touched, isValid)
  return (
    <Container maxWidth="sm">
      <Typography variant="h4">Create Data Source</Typography>
      <Divider style={{ margin: '20px 0' }} />
      <form onSubmit={handleSubmit} autoComplete="off">
        <FormControl
          fullWidth
          variant="outlined"
          size="small"
          error={errors.location && touched.location}
        >
          <InputLabel>Location</InputLabel>
          <Select
            labelId={`label-${dataValues.location}`}
            id="location"
            label="Location"
            value={dataValues.location}
            onChange={handleChange('location')}
            onBlur={handleBlur('location')}
          >
            <MenuItem value="INTERNAL">Internal</MenuItem>
            <MenuItem value="EXTERNAL">External</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          id="database"
          label="Database"
          value={dataValues.database}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ marginTop: 20 }}
          error={errors.database && touched.database}
          helperText={
            errors.database && touched.database ? errors.database : ''
          }
        />
        {console.log(errors, touched)}
        {dataValues.location === 'EXTERNAL' ? (
          <Fragment>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              id="host"
              label="Host"
              value={dataValues.host}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginTop: 20 }}
              error={errors.host && touched.host}
              helperText={errors.host && touched.host ? errors.host : ''}
            />
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              id="port"
              label="Port"
              value={dataValues.port}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginTop: 20 }}
              error={errors.port && touched.port}
              helperText={errors.port && touched.port ? errors.port : ''}
            />

            <FormControl
              fullWidth
              variant="outlined"
              size="small"
              style={{ marginTop: 20 }}
              error={errors.dialect && touched.dialect}
              helperText={
                errors.dialect && touched.dialect ? errors.dialect : ''
              }
            >
              <InputLabel>Dialect</InputLabel>
              <Select
                labelId={`label-${dataValues.dialect}`}
                id="dialect"
                label="Dialect"
                value={dataValues.dialect}
                onChange={handleChange('dialect')}
                onBlur={handleBlur('dialect')}
              >
                <MenuItem value="MYSQL">MySQL</MenuItem>
                <MenuItem value="POSTGRES">Postgres</MenuItem>
                <MenuItem value="MONGODB">MongoDB</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              id="username"
              label="Username"
              value={dataValues.username}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginTop: 20 }}
              error={errors.username && touched.username}
              helperText={
                errors.username && touched.username ? errors.username : ''
              }
            />
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              id="password"
              label="Password"
              value={dataValues.password}
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ marginTop: 20 }}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password ? errors.password : ''
              }
            />
          </Fragment>
        ) : null}
        <Divider style={{ margin: '20px 0' }} />
        <Box textAlign="center">
          <Button
            color="primary"
            variant="contained"
            style={{ marginRight: 8 }}
            type="submit"
            disabled={!isValid}
          >
            Create
          </Button>
          {dataValues.location === 'EXTERNAL' ? (
            <Button color="primary" variant="outlined">
              Test Connection
            </Button>
          ) : null}
        </Box>
      </form>
    </Container>
  )
}

export default Create
