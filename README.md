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

| Parameter | Type | Description | Ví dụ |
|:---|:---|:---|
| dataSet | event[] | Các events được hiển thị trên Calendar | `[{id:1,title:'Khám sức khỏe',start: new Date(2018,0,1,10,30,0),end: new Date(2018,0,1,12,45,0),group:'Mr An'}]` |
| date | Date | Ngày hiện tại (giá trị sẽ được highlight là ngày hiện tại trên calendar) | `new Date()` |
| visibleDates | Date[] | Danh sách các ngày sẽ được hiển thị trên calendar | `[new Date(2018,0,1),new Date(2018,0,2),new Date(2018,0,3),]` |
| workingHourRange | Object({from:number, to:number}) | Thời gian làm việc trong một ngày (những cell nằm ngoài thời gian làm việc sẽ có màu xám) | `{from:8,to:17}` từ 8 giờ sáng đến 5 giờ chiều |
| dayOffs | `number[]` | Các ngày nghỉ trong tuần từ thứ 2 đến chủ nhật theo thứ tự từ số 1 đến số 7 | `[6,7]` (thứ 7 và chủ nhật) |
| groups | `string[]` | Các nhóm muốn hiển thị trên Calendar | `['Mr An','Mr Ha']` |



### event

Mỗi `event` gồm các field như bên dưới:
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
