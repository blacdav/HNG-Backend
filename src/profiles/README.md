# Profiles Export Endpoint

## Overview

This endpoint exports profile records as a CSV file based on a natural-language search query.

The route is mounted in `src/profiles/routes/index.routes.js` as:

- `GET /profiles/export`

The implementation lives in `src/profiles/controllers/export.profile.js`.

## Query Parameters

- `q` (required): natural-language query string used to filter profiles.
- `page` (optional): parsed by the controller but currently not applied to exported results.
- `limit` (optional): parsed by the controller but currently not applied to exported results.

## Supported Search Syntax

The `q` parameter can include any of the following filters together:

- Age ranges
  - `between 25 and 35`
  - `18-25 years`
  - `older than 30`
  - `under 40`
  - `young`

- Gender
  - `male`
  - `female`
  - `male and female`

- Age groups
  - `senior`
  - `adult`
  - `teenager`
  - `child`

- Country
  - `from nigeria`
  - `in canada`

- Registration / date range
  - `today`
  - `yesterday`
  - `this week`
  - `this month`
  - `this year`

- Sorting
  - `sort by age asc`
  - `order by name desc`
  - supported fields: `age`, `name`, `country`, `gender`, `registered`, `date`

- Free keyword search
  - searches `name` and `country_name` when no structured filter applies

## Response

On success, the endpoint returns a CSV attachment with headers:

- `id`
- `name`
- `gender`
- `gender_probability`
- `sample_size`
- `age`
- `age_group`
- `country_id`
- `country_name`
- `country_probability`
- `created_at`
- `updated_at`

Response headers include:

- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename=profiles_export.csv`

## Error Handling

- `400 Bad Request` when:
  - `q` is missing, empty, or not a string.
  - the query contains incomplete filter language that cannot be parsed.

- `500 Internal Server Error` when the export fails on the server side.

## Examples

```http
GET /profiles/export?q=young%20female%20from%20nigeria
```

```http
GET /profiles/export?q=between%2025%20and%2035%20sort%20by%20age%20asc
```

```http
GET /profiles/export?q=this%20month%20male
```

## Notes

- The endpoint uses Sequelize to query `Profile` records.
- The current implementation does not apply `page` or `limit` to the exported results.
- If a query contains unsupported or incomplete syntax, the endpoint returns a parse error rather than a partial result.
