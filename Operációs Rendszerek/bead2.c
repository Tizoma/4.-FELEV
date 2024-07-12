#include <stdio.h>
#include <stdbool.h>
#include <signal.h>
#include <time.h>
#include <stdlib.h>
#include <unistd.h>
#include <wait.h>
#include <sys/types.h>
#include <string.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/msg.h>
#include <sys/ipc.h>

struct uzenet{
	long mtype;
	char mtext[1000];
};

void handler(int signum){
	//printf("Signal erkezett, %d \n",signum);
}

int main(){
	printf("Locsolóvers feljegyző program\n");
	FILE* fp = fopen("locsoloversek.txt","a+");
	if(!fp)
	{
		printf("Fájl nem található!\n");
		printf("A fájlt 'locsoloversek.txt' néven kell elnevezni!\n");
		return -1;
	}
	sigset_t sigset;
	sigfillset(&sigset);
	sigdelset(&sigset,SIGUSR1);
	sigdelset(&sigset,SIGUSR2);
	sigdelset(&sigset,SIGCHLD);
	sigprocmask(SIG_SETMASK,&sigset,NULL);
	signal(SIGUSR1,handler);
	signal(SIGUSR2,handler);
	int csoid=mkfifo("/tmp/krmpot",0666);
	if(csoid==-1){
		perror("Cső létrehozása sikertelen!\n");
		return 1;
	}
	key_t uzkulcs=ftok("/tmp/krmpot",66);
	int uzenetsor=msgget(uzkulcs,0666 |IPC_CREAT);
	if(uzenetsor<0){
		perror("Üzenetsor létrehozása sikertelen!\n");
		return 1;
	}
	pid_t parent=getpid();
	bool existing_children[]={true,true,true,true};
	int voltlocsolni=0;
	pid_t children[4];
	for(int i=0; i<4;i++){
		if(getpid()==parent){
			children[i]=fork();
			if(children[i]<0){
				perror("Gyerek process létrehozása sikertelen volt!\n");
				return 1;
			}
		}
	}
	if(getpid()==parent){
	bool kilepes=false;
	int versszam=0;
	char szamlalas[300];
	while(fgets(szamlalas,300,fp)){
		if( (char) szamlalas[0] == '#'){
			versszam++;
		}
	}
	fseek(fp,0,SEEK_SET);
	do{
		int valasztas;
		printf("Mit szeretne csinálni?\n");
		printf("1. Új verset fölvenni\n");
		printf("2. Listázni a már meglévő verseket\n");
		printf("3. Törölni egy adott sorszámú verset\n");
		printf("4. Módosítani egy adott sorszámú verset\n");
		printf("5. Locsolás\n");
		printf("6. Kilépés a programból\n");
		scanf("%d",&valasztas);
		switch(valasztas){
			//Feljegyzés
			case 1:
			printf("Hány soros verset szeretne feljegyezni?\n");
			int sordb=0;
			scanf("%d",&sordb);
			fprintf(fp,"#");
			printf("Most pedig írja be a verset!\n");
			for (int i=0; i<=sordb;i++){
			char input[300];
			fgets(input,300,stdin);
			fprintf(fp,input);
			}
			versszam++;
			break;
			
			//Kiírás
			case 2:;
			char be[300];
			int counter=0;
			while(fgets(be,300,fp)){
				if( (char) be[0] == '#'){
					counter++;
					printf("%d. vers:\n",counter);
				}else{
				printf("%s",be);
				}
			}
			break;
			
			//Törlés
			case 3:
			printf("Adja meg a törölni kívánt vers sorszámát!\n");
			int versszamt;
			scanf("%d",&versszamt);
			FILE* tmp = fopen("tmp.txt","w");
			if(!tmp){
				printf("Ideiglenes fájl megnyitása sikertelen!\n");
				return -1;
			}
			char buffer[300];
			int counter2=0;
			while(fgets(buffer,300,fp)){
				if((char) buffer[0]=='#'){
					counter2++;
				}
				if(counter2!=versszamt){
					fprintf(tmp,buffer);
				}
			}
			fclose(tmp);
			remove("locsoloversek.txt");
			rename("tmp.txt","locsoloversek.txt");
			fp= fopen("locsoloversek.txt","a+");
			versszam--;
			break;
			
			//Módosítás
			case 4:
			printf("Adja meg a módosítani kívánt vers sorszámát!\n");
			int modszam;
			scanf("%d",&modszam);
			FILE* tmp2 = fopen("tmp2.txt","w");
			if(!tmp2){
				printf("Ideiglenes fájl megnyitása sikertelen!\n");
				return -1;
			}
			char buffer2[300];
			int counter3=0;
			bool modositva=false;
			while(fgets(buffer2,300,fp)){
				if((char)buffer2[0]=='#'){
					counter3++;
				}
				if(counter3!=modszam){
					fprintf(tmp2,buffer2);
				}else if(!modositva){
					int ujsorszam;
					printf("Adja meg, hogy a vers módosított verziójának hány sora van!\n");
					scanf("%d",&ujsorszam);
					fprintf(tmp2,"#");
					printf("Most pedig írja be a módosított verset!\n");
					for(int i=0;i<=ujsorszam;++i){
						char input2[300];
						fgets(input2,300,stdin);
						fprintf(tmp2,input2);
					}
					modositva=true;
				}
			}
			fclose(tmp2);
			remove("locsoloversek.txt");
			rename("tmp2.txt","locsoloversek.txt");
			fp=fopen("locsoloversek.txt","a+");
			if(!fp){
				printf("Fájl megnyitás sikertelen!\n");
				return -1;
			}
			break;

			//Locsolás
			case 5:
			//Megnézzük hogy van-e még vers amit elmondhatnak és van-e gyerek aki még nem mondott
			if(voltlocsolni==4){
				printf("Már mindegyik gyerek volt locsolni, többet nem tudnak menni!\n");
				break;
			}
			if(versszam<2){
				printf("Már nem maradt 2 vers amit a szülő tudna küldeni a gyereknek, adj meg új verset!\n");
			break;
			}

			//véletlenszerűen egyik gyereket "elküldi" locsolni
			srand(time(NULL));
			int rchild;
			do{
			rchild=rand()%4;
			}while(!existing_children[rchild]);
			kill(children[rchild],SIGUSR1);

			//Vár arra hogy a gyerek "megérkezzen" verset mondani
			sigsuspend(&sigset);
			char versek[2000]="";
			char versbuffer[300];
			int versindex1=(rand()%versszam)+1;
			int versindex2;
			do{
				versindex2=(rand()%versszam)+1;
			}while(versindex2==versindex1);
			if(versindex1>versindex2){
				int tmp=versindex1;
				versindex1=versindex2;
				versindex2=tmp;
			}
			int locsolocounter=0;
			while(fgets(versbuffer,300,fp)){
				if((char)versbuffer[0] =='#'){
					locsolocounter++;
					if(locsolocounter==versindex1 || locsolocounter == versindex2){
						strcat(versek,"#\n");
					}
				}else if(locsolocounter==versindex1 || locsolocounter== versindex2){
					strcat(versek,versbuffer);
					
				}
			}
			fseek(fp,0,SEEK_SET);

			//Elküldi csövön keresztül a 2 verset
			int cso=open("/tmp/krmpot",O_WRONLY);
			write(cso,versek,2000);
			close(cso);

			//Választott verset megkapja üzenetben, annak első karaktere hogy a 2 elküldütt vers közül
			//az első vagy masodikat választotta-e a gyyerek
			struct uzenet uzkapott;
			int status = msgrcv(uzenetsor,&uzkapott,sizeof(uzkapott.mtext),1,0);
			wait(NULL);
			existing_children[rchild]=false;
			voltlocsolni++;

			//Az alapján hogy melyik verset választotta a gyerek megkapjuk annak a valós sorszámát
			//majd töröljük a fájlból
			int elmondottvers=0;
			if(uzkapott.mtext[0]==1){
				elmondottvers=versindex1;
			}else if(uzkapott.mtext[0]==2){
				elmondottvers=versindex2;
			}
			FILE* tmp3 = fopen("tmp.txt","w");
			if(!tmp3){
				printf("Ideiglenes fájl megnyitása sikertelen!\n");
				return -1;
			}
			char ltorles[300];
			int ltcounter=0;
			while(fgets(ltorles,300,fp)){
				if((char) ltorles[0]=='#'){
					ltcounter++;
				}
				if(ltcounter!=elmondottvers){
					fprintf(tmp3,ltorles);
				}
			}
			fclose(tmp3);
			remove("locsoloversek.txt");
			rename("tmp.txt","locsoloversek.txt");
			fp=fopen("locsoloversek.txt","a+");
			versszam--;
			break;

			//Kilépés
			case 6:
			for(int i=0;i<4;i++){
				kill(children[i],SIGKILL);
			}
			unlink("/tmp/krmpot");
			msgctl(uzenetsor,IPC_RMID,NULL);
			kilepes=true;
			break;
			default:
			printf("Ilyen opció nincs! A következők közül válasszon!\n");
		}
		fseek(fp,0,SEEK_SET);
	}while(!kilepes);
	fclose(fp);

	//Gyerek
	}else{	
		//Alapból vár hogy a szülő elküldje verset mondani
		sigsuspend(&sigset);
		//Majd elmondja a szülőnek hogy odaért a lányhoz verset mondani és küldheti neki a 2 verset
		kill(getppid(),SIGUSR2);
		int cso=open("/tmp/krmpot",O_RDONLY);
		char versek[2000];
		read(cso,versek,sizeof(versek));
		close(cso);

		//Valaszt egyet a 2 vers közül
		srand(time(NULL));
		int valasztott=rand()%2+1;
		int i=0;
		int j=1;
		int childcounter=0;
		char vissza[1000]="";
		if(valasztott==1){
			vissza[0]=1;
		}else{
			vissza[0]=2;
		}

		//Kiírja a képernyőre a verseket, és a válaszott verset eltárolja, hogy azt később vissza
		//tudja küldeni a szülőnek üzenetsoron
		while(versek[i]!='\0'){
			if(versek[i]=='#'){
				childcounter++;
				printf("%d. vers:",childcounter);
			}else if(childcounter==valasztott){
				vissza[j]=versek[i];
				j++;
				printf("%c",versek[i]);
			}else{
			printf("%c",versek[i]);
			}
			i++;
		}

		//Kiírjuk a választott verset és hogy szabad-e locsolni
		printf("Választott vers:");
		printf(vissza);
		printf("Szabad-e locsolni?\n");

		//Visszaküldjük a kiválasztott verset
		struct uzenet uz;
		uz.mtype=1;
		strcpy(uz.mtext,vissza);
		int status = msgsnd(uzenetsor, &uz, sizeof(uz.mtext),0);
		//Meglocsoljuk a lányokat (terminál)
		return 0;	
	}
}
