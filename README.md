# Бекенд Stick Repletion - форум для программистов, на подобии Stack Overflow

## Эндпоинты

### Авторизация

`/signup`, POST — Эндпоинт для регистрации
```json
{
  "username": "example",
  "email": "example@example.com",
  "password": "example"
}
```
`/signin`, POST — Эндпоинт для авторизации
```json
{
  "email": "example@example.com",
  "password": "example"
}
```

### Пользователь

`/users`, GET - Эндпоинт для получения всех пользователей <br>
`/users/me`, GET - Эндпоинт для получения вашего пользователя <br>
`/users/:id`, GET - Эндпоинт для получения пользователя по уникальному id <br>
`/users/:id`, PATCH - Эндпоинт для изменения вашего пользователя
```json
{
  "username": "example",
  "avatar": "http://example.com/"
}
```

### Вопросы

`/questions`, GET - Эндпоинт для получения всех вопросов <br>
`/questions/:id`, GET - Эндпоинт для получения вопроса по уникальному id <br>
`/questions`, POST - Эндпоинт для создания нового вопроса
```json
{
  "title": "example",
  "problem": "example",
  "attemptsFix": "example",
  "tags": ["example", "example", "example"]
}
```
`/questions/rating/:id`, PUT - Эндпоинт для поднятия рейтинга вопроса на 1, по уникальному id <br>
`/questions/rating/:id`, DELETE - Эндпоинт для понижения рейтинга вопроса на 1, по уникальному id <br>
`/questions/:id`, PATCH - Эндпоинт для редактирования вопроса
```json
{
  "title": "example",
  "problem": "example",
  "attemptsFix": "example",
  "tags": ["example", "example", "example"]
}
```
`/questions/:id`, DELETE - Эндпоинт для удаления вопроса

### Ответы 

`/answers`, POST - Эндпоинт для создания ответа
```json
{
  "answer": "example",
  "_id": "questionId",
}
```
`/answers/rating/:id`, PUT - Эндпоинт для поднятия рейтинга ответа на 1, по уникальному id <br>
`/answers/rating/:id`, DELETE - Эндпоинт для понижения рейтинга ответа на 1, по уникальному id <br>
`/answers/:id`, PATCH - Эндпоинт для редактирования ответа 
```json
{
  "answer": "example",
}
```
`/answers/:id`, DELETE - Эндпоинт для удаления ответа
