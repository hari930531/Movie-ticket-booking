import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
  price: number;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
}

interface ShowtimeOption {
  session: 'Morning' | 'Afternoon' | 'Night';
  time: string;
  badge: string;
}

interface Ticket {
  ticketNumber: string;
  theaterName: string;
  theaterAddress: string;
  screenName: string;
  movieTitle: string;
  genre: string;
  duration: number;
  customerName: string;
  customerContact: string;
  seatNumber: string;
  showDate: string;
  showSession: string;
  showTime: string;
  totalPrice: number;
  bookedAt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly theaterName = "HARI 'S THEATER";
  readonly theaterLocation = "Sanarapatti, Perumbalai, Pennagaram, Dharmapuri - 636811";

  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  selectedMovie: Movie | null = null;
  customerName = '';
  customerContact = '';
  selectedSeat: Seat | null = null;
  confirmedTicket: Ticket | null = null;
  errorMessage = '';

  // Screen Filters
  screens: string[] = ['All Screens', 'Screen 1 (Dolby Atmos 4K)', 'Screen 2 (RGB Laser)', 'Screen 3 (VIP Luxe)'];
  selectedScreen: string = 'All Screens';

  // Live Digital Clock & Date
  currentDateStr = '';
  currentTimeStr = '';
  private clockTimer: any;

  // Show Dates
  availableDates: string[] = ['Today', 'Tomorrow', 'Sunday'];
  selectedDate: string = 'Today';

  // Selected Showtime
  selectedShowtime: ShowtimeOption | null = null;

  // Screen mapping for 9 movies
  movieScreenMap: Record<string, string> = {
    'Jailer 2': 'Screen 1 (Dolby Atmos 4K)',
    'Leo': 'Screen 1 (Dolby Atmos 4K)',
    'Vishwanath & Sons': 'Screen 1 (Dolby Atmos 4K)',
    'The Dark Knight': 'Screen 2 (RGB Laser)',
    'Spider-Man Remastered': 'Screen 2 (RGB Laser)',
    'Bramayugam': 'Screen 2 (RGB Laser)',
    'Kudumbasthan': 'Screen 3 (VIP Luxe)',
    'Kalamkaval': 'Screen 3 (VIP Luxe)',
    'Ekō': 'Screen 3 (VIP Luxe)'
  };

  // Morning, Afternoon, and Night showtimes per movie
  movieShowtimesMap: Record<string, ShowtimeOption[]> = {
    'Jailer 2': [
      { session: 'Morning', time: '10:30 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:15 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '06:45 PM', badge: '🌙 Night Show' }
    ],
    'Leo': [
      { session: 'Morning', time: '11:00 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:45 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '07:15 PM', badge: '🌙 Night Show' }
    ],
    'Vishwanath & Sons': [
      { session: 'Morning', time: '10:00 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '01:30 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '06:00 PM', badge: '🌙 Night Show' }
    ],
    'The Dark Knight': [
      { session: 'Morning', time: '10:15 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:00 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '06:30 PM', badge: '🌙 Night Show' }
    ],
    'Spider-Man Remastered': [
      { session: 'Morning', time: '11:15 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '03:00 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '07:30 PM', badge: '🌙 Night Show' }
    ],
    'Bramayugam': [
      { session: 'Morning', time: '10:45 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:30 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '07:00 PM', badge: '🌙 Night Show' }
    ],
    'Kudumbasthan': [
      { session: 'Morning', time: '10:00 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '01:45 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '06:15 PM', badge: '🌙 Night Show' }
    ],
    'Kalamkaval': [
      { session: 'Morning', time: '11:00 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:30 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '07:00 PM', badge: '🌙 Night Show' }
    ],
    'Eko': [
      { session: 'Morning', time: '10:30 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:00 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '06:30 PM', badge: '🌙 Night Show' }
    ]
  };

  // Exact .jpeg filename mappings matching files in public/movies/
  moviePosters: Record<string, string> = {
    'Jailer 2': 'movies/jailer2.jpeg',
    'Leo': 'movies/leo.jpeg',
    'Vishwanath & Sons': 'movies/vishwanath.jpeg',
    'The Dark Knight': 'movies/darkknight.jpeg',
    'Spider-Man Remastered': 'movies/spiderman.jpeg',
    'Bramayugam': 'movies/bramayugam.jpeg',
    'Kudumbasthan': 'movies/kudumbasthan.jpeg',
    'Kalamkaval': 'movies/kalamkaval.jpeg',
    'Eko': 'movies/eko.jpeg'
  };

  seats: Seat[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initSeats();
    this.fetchMovies();
    this.startLiveClock();
  }

  ngOnDestroy() {
    if (this.clockTimer) clearInterval(this.clockTimer);
  }

  startLiveClock() {
    const updateTime = () => {
      const now = new Date();
      this.currentDateStr = now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      this.currentTimeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      this.cdr.detectChanges();
    };
    updateTime();
    this.clockTimer = setInterval(updateTime, 1000);
  }

  initSeats() {
    const rows = ['A', 'B', 'C', 'D'];
    const cols = 6;
    const generated: Seat[] = [];
    const occupiedList = new Set(['A2', 'B4', 'C1', 'D5']);

    for (const r of rows) {
      for (let c = 1; c <= cols; c++) {
        const id = `${r}${c}`;
        generated.push({
          id,
          row: r,
          number: c,
          status: occupiedList.has(id) ? 'occupied' : 'available'
        });
      }
    }
    this.seats = generated;
  }

  fetchMovies() {
    this.http.get<Movie[]>('http://localhost:8080/api/movies')
      .subscribe({
        next: (data) => {
          this.movies = data;
          this.filterByScreen(this.selectedScreen);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading movies:', err);
          this.errorMessage = 'Could not load movies from server.';
          this.cdr.detectChanges();
        }
      });
  }

  filterByScreen(screen: string) {
    this.selectedScreen = screen;
    if (screen === 'All Screens') {
      this.filteredMovies = [...this.movies];
    } else {
      this.filteredMovies = this.movies.filter(m => this.movieScreenMap[m.title] === screen);
    }
    this.cdr.detectChanges();
  }

  getMoviePoster(title: string): string {
    return this.moviePosters[title] || '';
  }

  onPosterError(event: any, title: string) {
    const imgElement = event.target as HTMLImageElement;
    // Fallback: If root URL fails, attempt assets/ path
    if (!imgElement.src.includes('assets/')) {
      imgElement.src = `assets/${this.moviePosters[title] || ''}`;
    }
  }

  getScreenName(title: string): string {
    return this.movieScreenMap[title] || 'Screen 1';
  }

  getMovieShowtimes(title: string): ShowtimeOption[] {
    return this.movieShowtimesMap[title] || [
      { session: 'Morning', time: '10:30 AM', badge: '🌅 Morning Show' },
      { session: 'Afternoon', time: '02:30 PM', badge: '☀️ Matinee Show' },
      { session: 'Night', time: '07:00 PM', badge: '🌙 Night Show' }
    ];
  }

  selectMovie(movie: Movie) {
    this.selectedMovie = movie;
    this.confirmedTicket = null;
    this.errorMessage = '';
    const showtimes = this.getMovieShowtimes(movie.title);
    this.selectedShowtime = showtimes[0];

    this.seats.forEach(s => {
      if (s.status === 'selected') s.status = 'available';
    });
    this.selectedSeat = null;
    this.cdr.detectChanges();
  }

  chooseSeat(seat: Seat) {
    if (seat.status === 'occupied') return;

    if (this.selectedSeat) {
      this.selectedSeat.status = 'available';
    }

    seat.status = 'selected';
    this.selectedSeat = seat;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  bookTicket() {
    if (!this.selectedMovie) {
      this.errorMessage = 'Please select a movie.';
      return;
    }
    if (!this.selectedSeat) {
      this.errorMessage = 'Please choose a seat from the seating layout.';
      return;
    }
    if (!this.selectedShowtime) {
      this.errorMessage = 'Please select a showtime session.';
      return;
    }
    if (!this.customerName.trim() || !this.customerContact.trim()) {
      this.errorMessage = 'Please enter both your name and contact mobile number.';
      return;
    }

    const assignedScreen = this.getScreenName(this.selectedMovie.title);

    const payload = {
      movieId: this.selectedMovie.id,
      customerName: `${this.customerName.trim()} (${this.customerContact.trim()})`,
      seatNumber: this.selectedSeat.id,
      theater: `${this.theaterName} [${assignedScreen}]`,
      showDate: this.selectedDate,
      showTime: `${this.selectedShowtime.session} - ${this.selectedShowtime.time}`,
      totalAmount: this.selectedMovie.price
    };

    this.http.post('http://localhost:8080/api/bookings', payload)
      .subscribe({
        next: () => {
          const bookedSeatId = this.selectedSeat!.id;

          this.confirmedTicket = {
            ticketNumber: 'HT-' + Math.floor(100000 + Math.random() * 900000),
            theaterName: this.theaterName,
            theaterAddress: this.theaterLocation,
            screenName: assignedScreen,
            movieTitle: this.selectedMovie!.title,
            genre: this.selectedMovie!.genre,
            duration: this.selectedMovie!.duration,
            customerName: this.customerName.trim(),
            customerContact: this.customerContact.trim(),
            seatNumber: bookedSeatId,
            showDate: this.selectedDate,
            showSession: this.selectedShowtime!.session,
            showTime: this.selectedShowtime!.time,
            totalPrice: this.selectedMovie!.price,
            bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          const seatObj = this.seats.find(s => s.id === bookedSeatId);
          if (seatObj) seatObj.status = 'occupied';

          this.customerName = '';
          this.customerContact = '';
          this.selectedSeat = null;
          this.errorMessage = '';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error confirming ticket:', err);
          this.errorMessage = 'Failed to confirm booking on the backend.';
          this.cdr.detectChanges();
        }
      });
  }

  printTicket() {
    window.print();
  }
}