#!/usr/bin/perl

use strict;
use File::Find::Rule;
use File::Basename;

my @dirs = ("img", "sfx");

my @files = File::Find::Rule->file()
							->name('*.png', '*.jpg')
                            ->in(@dirs);
                            
my $counter;
                            
open(my $fh, '>', 'manifest.json');

print $fh "{ \"manifest\": [\n";
foreach my $file (@files)
{
	my($filename, $dirs, $suffix) = fileparse($file, qr/\.[^.]*/);
	if (++$counter == scalar(@files))
	{
		print $fh "{ \"id\": \"$filename\", \"src\": \"$file\" }\n";
	}
	else
	{
		print $fh "{ \"id\": \"$filename\", \"src\": \"$file\" },\n";
	}
}
print $fh "] }\n";

close $fh;
print "manifest.json updated, yay!\n";

exit 0;