#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <sys/types.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/msg.h>
#include <sys/ipc.h>
#include <wait.h>

struct uzenet{
	long mtype;
	char mtext[200];
};

void handler(){}
void loginhandler(int signum){
	if(signum==SIGUSR1){
		printf("Hallgató bejelentkezett!\n");
	}
	if(signum==SIGUSR2){
		printf("Témavezető bejelentkezett!\n");
	}
}
int main(){
	printf("Oprend Gyakorlati ZH\n");
	signal(SIGUSR1,loginhandler);
	signal(SIGUSR2,loginhandler);
	sigset_t sigset;
	sigfillset(&sigset);
	sigdelset(&sigset,SIGUSR1);
	sigdelset(&sigset,SIGUSR2);
	sigdelset(&sigset,SIGCHLD);
	sigprocmask(SIG_SETMASK,&sigset,NULL);
	int csoid=mkfifo("/tmp/krmpot",0666);
	if(csoid==-1){
		perror("Cső létrehozása sikertelen!\n");
		return 1;
	}
	int pipefd[2];
	if(pipe(pipefd)== -1){
		perror("Hiba történt a cső megnyitásakor!\n");		
	}
	key_t uzkulcs=ftok("/tmp/krmpot",66);
	int uzenetsor=msgget(uzkulcs,0666|IPC_CREAT);
	if(uzenetsor<0){
		perror("Üzenetsor létrehozása sikertelen!\n");
		return 1;
	}
	pid_t neptun=getpid();
	pid_t hallgato=fork();
	pid_t temavezeto;
	if(getpid()==neptun){
		temavezeto=fork();
	}

	if(getpid()==neptun){
		sigsuspend(&sigset);
		sigsuspend(&sigset);
		printf("Mind a hallgató, mind a témavezető sikeresen bejelentkezett!\n");
		int csobe=open("/tmp/krmpot",O_RDONLY);
		char n_bejelento[100];
		read(csobe,n_bejelento,sizeof(n_bejelento));
		close(csobe);
		close(pipefd[0]);
		write(pipefd[1],n_bejelento,100);
		close(pipefd[0]);
		wait(NULL);
		wait(NULL);
		unlink("/tmp/krmpot");
		msgctl(uzenetsor,IPC_RMID,NULL);
	}else if(hallgato==0){
		kill(getppid(),SIGUSR1);
		int hcso=open("/tmp/krmpot",O_WRONLY);
		char bejelento[]="Dolgozat címe,Hallgató neve,2024,Témavezető neve";
		write(hcso,bejelento,100);
		close(hcso);
		struct uzenet uzkapott;
		int status = msgrcv(uzenetsor,&uzkapott,sizeof(uzkapott.mtext),1,0);
		printf("%s\n",uzkapott.mtext);
		return 0;
	}else if(temavezeto==0){
		kill(getppid(),SIGUSR2);
		char t_bejelento[100];
		close(pipefd[1]);
		read(pipefd[0],t_bejelento,100);
		close(pipefd[0]);
		printf("%s\n",t_bejelento);
		struct uzenet uz= {1, "Milyen technológiával szeretné a feladatát megvalósítani?"};
		int status=msgsnd(uzenetsor,&uz,sizeof(uz.mtext),0);
		return 0;
	}

}
