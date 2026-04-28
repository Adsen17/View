<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessage;

class ContactController extends Controller
{
    public function show()
    {
        return view('contact');
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        try {
            Mail::to('Keiferr17@gmail.com')->send(new ContactMessage($validated));
            
            return back()->with('success', 'Signal Delivered Successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Transmission Failed. Check connection protocols.')->withInput();
        }
    }
}
