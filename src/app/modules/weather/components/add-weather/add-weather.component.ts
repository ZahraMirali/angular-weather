import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WeatherService } from './../../services/weather.service';
import { WeatherList } from '../../models/weather.model';
import { SnackBar } from '../../services/snack-bar.service';

@Component({
  selector: 'app-add-weather',
  templateUrl: './add-weather.component.html',
  styleUrls: ['./add-weather.component.scss'],
})
export class AddWeatherComponent implements OnInit {
  public registerForm!: FormGroup;
  public isLoading: boolean = false;
  public weatherInfo: WeatherList = {
    coord: {
      lon: 0,
      lat: 0,
    },
    weather: [],
    base: '',
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
    },
    visibility: 0,
    wind: {
      speed: 0,
      deg: 0,
    },
    clouds: {
      all: 0,
    },
    dt: 0,
    sys: {
      type: 0,
      id: 0,
      country: '',
      sunrise: 0,
      sunset: 0,
    },
    timezone: 0,
    id: 0,
    name: '',
    cod: 0,
    url: '',
  };
  public cityIsAdded: boolean = false;
  public weatherList: WeatherList[] = [];

  constructor(
    private weatherApi: WeatherService,
    private openSnackBar: SnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getWeatherList();
  }

  getWeatherList() {
    if (JSON.parse(localStorage.getItem('weatherList') || '')) {
      this.weatherList = JSON.parse(localStorage.getItem('weatherList') || '');
    }
  }

  initForm() {
    this.registerForm = new FormGroup({
      city: new FormControl('', Validators.required),
    });
  }

  get city() {
    return this.registerForm.get('city');
  }

  addCity(weather: WeatherList) {
    this.weatherList.push(weather);
    localStorage.setItem('weatherList', JSON.stringify(this.weatherList));
    this.openSnackBar.showSnackBar('successfully added ', 'info', 2000);
    this.cityIsAdded = true;
  }

  onSubmit() {
    this.cityIsAdded = false;
    this.isLoading = true;
    if (this.city?.value === '') {
      this.isLoading = false;
      this.openSnackBar.showSnackBar('Please enter city', 'warn', 2000);
    } else {
      this.weatherApi.addCity(this.city?.value).subscribe(
        (res) => {
          this.weatherInfo = res;
          this.weatherInfo.url = `assets/svg/${res.weather[0].main}.svg`;
          this.checkCityExist(this.weatherInfo);
          this.isLoading = false;
        },

        (error) => {
          this.isLoading = false;
          if (error.status === 404) {
            this.openSnackBar.showSnackBar('city not found ', 'warn', 2000);
          } else {
            this.openSnackBar.showSnackBar(
              'An unexpected error ocurred !!',
              'warn',
              2000
            );
          }
        }
      );
    }
  }

  checkCityExist(weather: WeatherList) {
    this.weatherList.find((el) => {
      if (el.id == weather.id) {
        this.cityIsAdded = true;
      }
    });
  }
}
