package main

import (
	"log"
	"os"
)

var (
	Lerror   = log.New(os.Stdout, "ERROR ", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile)
	Lwarning = log.New(os.Stdout, "WARNING ", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile)
	Linfo    = log.New(os.Stdout, "INFO ", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile)
)
