export const transformSortQuery = (sortQuery) => {
  if (!sortQuery) {
    return []
  }
  const sortQueryTransformed = []
  sortQuery.forEach((sort) => {
    sortQueryTransformed.push({
      field: sort[0],
      order: sort[1] === 'ASC' ? 1 : -1
    })
  })
  return sortQueryTransformed
}

export const onSortQuery = (sortQuery, e) => {
  if (!sortQuery) {
    sortQuery = []
  }
  let updatedSortQuery = []
  console.log(sortQuery)
  e.multiSortMeta.forEach((sortMeta) => {
    updatedSortQuery.push([
      sortMeta.field,
      sortMeta.order === 1 ? 'ASC' : 'DESC'
    ])
  })
  return updatedSortQuery
}
