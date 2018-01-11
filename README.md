react-big-calendar
========================

Lib react-ht-calendar

## Sử dụng

`npm install http://github.com/thuanhd/react-ht-calendar --save`
Thêm các file style
Thêm jquery

## Chạy examples local

* Clone repository
* Install: `npm install`
* Start: `npm run examples`
* Open [localhost:3000/examples/index.html](http://localhost:3000/examples/index.html).

## Input

### dataSet

Nhận vào các `events` được hiển thị trên calendar. Mỗi `event` gồm các field như bên dưới:
 * `id` (type: `string|number`): dùng để định danh cho 1 `event`
 * `title` (type: `string`): Tiêu đề của `event`
 * `start` (type: `Date`): Thời điểm bắt đầu của `event`
 * `end` (type: `Date`): Thời điểm kết thúc của `event`
 * `group` (type: `string`): định danh nhóm của `event`

### Localization and Date Formatting

`react-big-calendar` includes two options for handling the date formatting and culture localization, depending
on your preference of DateTime libraries. You can use either the [Moment.js](http://momentjs.com/) or [Globalize.js](https://github.com/jquery/globalize) localizers.

Regardless of your choice, you __must__ choose a localizer to use this library:

#### Moment.js

```js
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
```

#### Globalize.js v0.1.1

```js
import BigCalendar from 'react-big-calendar';
import globalize from 'globalize';

BigCalendar.setLocalizer(
  BigCalendar.globalizeLocalizer(globalize)
);
```
