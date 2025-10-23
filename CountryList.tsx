import React, { useState, useMemo } from 'react'
import { useQuery, gql } from '@apollo/client'
import { 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  TextField,
  Box,
  Pagination,
  Typography,
  Skeleton,
  Card,
  CardContent,
  InputAdornment,
  IconButton
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

const COUNTRIES = gql`
  query Countries {
    countries {
      code
      name
      emoji
      capital
      currency
      continent {
        name
      }
    }
  }
`

const ITEMS_PER_PAGE = 10

export default function CountryList() {
  const { data, loading, error } = useQuery(COUNTRIES)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = useMemo(() => {
    if (!data?.countries) return []
    return data.countries.filter((country: any) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const paginatedCountries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredCountries.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredCountries, page])

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(1) // Reset to first page when search changes
  }

  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  if (error) return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">Error: {error.message}</Typography>
    </Box>
  )

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search countries..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      {loading ? (
        <Box sx={{ mt: 2 }}>
          {[...Array(3)].map((_, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent>
                <Skeleton animation="wave" height={40} />
                <Skeleton animation="wave" height={20} width="60%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Found {filteredCountries.length} countries
            </Typography>
          </Box>

          <List>
            {paginatedCountries.map((country: any) => (
              <Card key={country.code} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" component="div">
                        {country.name} {country.emoji}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {country.continent.name}
                      </Typography>
                      {country.capital && (
                        <Typography variant="body2">
                          Capital: {country.capital}
                        </Typography>
                      )}
                      {country.currency && (
                        <Typography variant="body2">
                          Currency: {country.currency}
                        </Typography>
                      )}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        px: 1, 
                        py: 0.5, 
                        borderRadius: 1 
                      }}
                    >
                      {country.code}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>

          {filteredCountries.length > ITEMS_PER_PAGE && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={Math.ceil(filteredCountries.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          {filteredCountries.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="text.secondary">
                No countries found matching "{searchTerm}"
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
